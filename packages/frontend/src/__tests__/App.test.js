import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Mock fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

const renderApp = (queryClient = createTestQueryClient()) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

test('renders TODO App heading', async () => {
  renderApp();
  const headingElement = await screen.findByText(/TODO App/i);
  expect(headingElement).toBeInTheDocument();
});

describe('Delete functionality', () => {
  test('deletes a todo when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockTodos = [
      { id: '1', title: 'Test todo', completed: false },
      { id: '2', title: 'Another todo', completed: false },
    ];

    global.fetch.mockImplementation((url, options) => {
      if (options?.method === 'DELETE') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      });
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText('Test todo')).toBeInTheDocument();
    });

    // Find delete button by aria-label or test-id instead of DOM query
    const deleteButtons = screen.getAllByLabelText(/delete/i);
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/todos/1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });
});

describe('Stats calculation', () => {
  test('calculates and displays correct stats for todos', async () => {
    const mockTodos = [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: true },
      { id: '3', title: 'Todo 3', completed: false },
      { id: '4', title: 'Todo 4', completed: true },
    ];

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTodos),
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/2 items left/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/2 completed/i)).toBeInTheDocument();
  });

  test('shows 0 items left when all todos are completed', async () => {
    const mockTodos = [
      { id: '1', title: 'Todo 1', completed: true },
      { id: '2', title: 'Todo 2', completed: true },
    ];

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTodos),
    });

    renderApp();

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText('Todo 1')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/0 items left/i)).toBeInTheDocument();
    expect(screen.getByText(/2 completed/i)).toBeInTheDocument();
  });
});

describe('Empty state', () => {
  test('displays empty state message when there are no todos', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
    });
  });

  test('does not show empty state when todos exist', async () => {
    const mockTodos = [{ id: '1', title: 'Test todo', completed: false }];

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTodos),
    });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText('Test todo')).toBeInTheDocument();
    });

    expect(screen.queryByText(/no todos yet/i)).not.toBeInTheDocument();
  });
});

describe('Error handling', () => {
  test('displays error message when fetch fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    
    global.fetch.mockRejectedValue(new Error('Network error'));

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/failed to load todos/i)).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });

  test('allows retry after error', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    const user = userEvent.setup();

    global.fetch.mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ id: '1', title: 'Test todo', completed: false }]),
      });

    renderApp();

    await waitFor(() => {
      expect(screen.getByText(/failed to load todos/i)).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Test todo')).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
