/**
 * Page Object Model for TODO application
 * Encapsulates selectors and interactions for reusability
 */
class TodoPage {
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.todoInput = page.getByPlaceholder('What needs to be done?');
    this.addButton = page.getByRole('button', { name: /add/i });
    this.emptyStateMessage = page.getByText(/no todos yet/i);
    this.errorMessage = page.getByText(/failed to load todos/i);
    this.retryButton = page.getByRole('button', { name: /retry/i });
  }

  /**
   * Navigate to the TODO application
   */
  async goto() {
    await this.page.goto('/');
    // Wait for app to be ready
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Add a new todo
   * @param {string} title - The todo title
   */
  async addTodo(title) {
    await this.todoInput.fill(title);
    await this.addButton.click();
    // Wait for the todo to appear
    await this.getTodoByTitle(title).waitFor({ state: 'visible' });
  }

  /**
   * Get a todo item by its title text
   * @param {string} title - The todo title
   */
  getTodoByTitle(title) {
    return this.page.getByRole('listitem').filter({ hasText: title });
  }

  /**
   * Toggle a todo's completion status
   * @param {string} title - The todo title
   */
  async toggleTodo(title) {
    const todoItem = this.getTodoByTitle(title);
    const checkbox = todoItem.getByRole('checkbox');
    await checkbox.click();
  }

  /**
   * Delete a todo
   * @param {string} title - The todo title
   */
  async deleteTodo(title) {
    const todoItem = this.getTodoByTitle(title);
    const deleteButton = todoItem.getByLabel(/delete/i);
    await deleteButton.click();
    // Wait for the todo to be removed
    await todoItem.waitFor({ state: 'hidden' });
  }

  /**
   * Get the stats chip text
   * @param {string} type - 'items' or 'completed'
   */
  getStatsChip(type) {
    if (type === 'items') {
      return this.page.getByText(/items left/i);
    }
    return this.page.getByText(/completed/i);
  }

  /**
   * Get the count from a stats chip
   * @param {string} type - 'items' or 'completed'
   */
  async getStatsCount(type) {
    const chip = this.getStatsChip(type);
    const text = await chip.textContent();
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Check if a todo is marked as completed (has strikethrough)
   * @param {string} title - The todo title
   */
  async isTodoCompleted(title) {
    const todoItem = this.getTodoByTitle(title);
    const checkbox = todoItem.getByRole('checkbox');
    return await checkbox.isChecked();
  }

  /**
   * Get all visible todos
   */
  async getAllTodos() {
    return await this.page.getByRole('listitem').all();
  }
}

module.exports = { TodoPage };
