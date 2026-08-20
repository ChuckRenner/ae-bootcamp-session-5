/**
 * End-to-End UI Tests for TODO Application
 * Covers critical user journeys: create, toggle, delete, stats, and error handling
 */
const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

test.describe('TODO Application - Critical User Journeys', () => {
  let todoPage;

  test.beforeEach(async ({ page, request }) => {
    // Clear backend data before each test to ensure isolation
    await request.delete('http://localhost:3001/api/todos');
    
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('should create a new todo and display it in the list', async ({ page }) => {
    // Given: User is on the TODO app
    await expect(todoPage.emptyStateMessage).toBeVisible();

    // When: User creates a new todo
    await todoPage.addTodo('Buy groceries');

    // Then: The todo appears in the list
    const todo = todoPage.getTodoByTitle('Buy groceries');
    await expect(todo).toBeVisible();
    
    // And: Empty state is no longer shown
    await expect(todoPage.emptyStateMessage).not.toBeVisible();
    
    // And: Stats show 1 incomplete item
    await expect(todoPage.getStatsChip('items')).toHaveText('1 items left');
    await expect(todoPage.getStatsChip('completed')).toHaveText('0 completed');
  });

  test('should toggle todo completion and update stats correctly', async ({ page }) => {
    // Given: A todo exists
    await todoPage.addTodo('Write tests');
    
    // When: User toggles the todo to completed
    await todoPage.toggleTodo('Write tests');
    
    // Then: Stats reflect the completion (wait for update)
    await expect(todoPage.getStatsChip('items')).toHaveText('0 items left');
    await expect(todoPage.getStatsChip('completed')).toHaveText('1 completed');
    
    // And: The checkbox is checked
    const isCompleted = await todoPage.isTodoCompleted('Write tests');
    expect(isCompleted).toBe(true);
    
    // When: User toggles it back to incomplete
    await todoPage.toggleTodo('Write tests');
    
    // Then: Stats reflect the change (wait for update)
    await expect(todoPage.getStatsChip('items')).toHaveText('1 items left');
    await expect(todoPage.getStatsChip('completed')).toHaveText('0 completed');
    
    // And: The checkbox is unchecked
    const isStillCompleted = await todoPage.isTodoCompleted('Write tests');
    expect(isStillCompleted).toBe(false);
  });

  test('should delete a todo and update the list', async ({ page }) => {
    // Given: Multiple todos exist
    await todoPage.addTodo('First task');
    await todoPage.addTodo('Second task');
    await todoPage.addTodo('Third task');
    
    // Verify all 3 todos are present
    const todos = await todoPage.getAllTodos();
    expect(todos.length).toBe(3);
    
    // When: User deletes the second todo
    await todoPage.deleteTodo('Second task');
    
    // Then: Only 2 todos remain
    const remainingTodos = await todoPage.getAllTodos();
    expect(remainingTodos.length).toBe(2);
    
    // And: The deleted todo is not visible
    await expect(todoPage.getTodoByTitle('Second task')).not.toBeVisible();
    
    // And: Other todos are still present
    await expect(todoPage.getTodoByTitle('First task')).toBeVisible();
    await expect(todoPage.getTodoByTitle('Third task')).toBeVisible();
    
    // And: Stats are correct
    await expect(todoPage.getStatsChip('items')).toHaveText('2 items left');
  });

  test('should calculate and display stats correctly with mixed completion states', async ({ page }) => {
    // Given: Multiple todos with different completion states
    await todoPage.addTodo('Task 1');
    await todoPage.addTodo('Task 2');
    await todoPage.addTodo('Task 3');
    await todoPage.addTodo('Task 4');
    
    // When: User completes some todos
    await todoPage.toggleTodo('Task 1');
    await todoPage.toggleTodo('Task 3');
    
    // Then: Stats accurately reflect the state
    await expect(todoPage.getStatsChip('items')).toHaveText('2 items left');
    await expect(todoPage.getStatsChip('completed')).toHaveText('2 completed');
    
    // When: User deletes a completed todo
    await todoPage.deleteTodo('Task 1');
    
    // Then: Stats update correctly
    await expect(todoPage.getStatsChip('items')).toHaveText('2 items left');
    await expect(todoPage.getStatsChip('completed')).toHaveText('1 completed');
    
    // When: User completes all remaining incomplete todos
    await todoPage.toggleTodo('Task 2');
    await todoPage.toggleTodo('Task 4');
    
    // Then: All todos are completed
    await expect(todoPage.getStatsChip('items')).toHaveText('0 items left');
    await expect(todoPage.getStatsChip('completed')).toHaveText('3 completed');
  });

  test('should display error message when backend is unavailable and allow retry', async ({ page }) => {
    // Given: Backend API is unavailable (simulate by blocking requests)
    await page.route('**/api/todos', route => {
      route.abort('failed');
    });
    
    // When: User navigates to the app
    await todoPage.goto();
    
    // Then: Error message is displayed
    await expect(todoPage.errorMessage).toBeVisible();
    await expect(todoPage.retryButton).toBeVisible();
    
    // And: No todos are shown
    const todos = await todoPage.getAllTodos();
    expect(todos.length).toBe(0);
    
    // When: Backend becomes available
    await page.unroute('**/api/todos');
    
    // And: User clicks retry
    await todoPage.retryButton.click();
    
    // Then: Error message disappears
    await expect(todoPage.errorMessage).not.toBeVisible();
    
    // And: Empty state is shown (since no todos exist)
    await expect(todoPage.emptyStateMessage).toBeVisible();
    
    // And: User can now create todos successfully
    await todoPage.addTodo('Backend is back!');
    await expect(todoPage.getTodoByTitle('Backend is back!')).toBeVisible();
  });
});