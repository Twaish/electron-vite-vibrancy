export type Callback = (...args: any[]) => any
export type API = {
  /**
   * Executes the main operation
   * @param {...any} args - Arguments to pass to the run function. The first parameter is always the event
   * @returns {Promise<any>} Result of the operation
   */
  run: (...args: any[]) => Promise<any>

  /**
   * Registers an event listener
   * @param {string} event - Event name to listen for
   * @param {string} id - Unique identifier for the listener
   * @param {Callback} callback - Function to execute when event occurs
   * @returns {Function} Cleanup function to remove event listener
   */
  on: (event: string, id: string, callback: Callback) => () => void

  /**
   * Removes an event listener
   * @param {string} event - Event name
   * @param {string} [id] - Optional identifier to remove specific listener
   */
  off: (event: string, id?: string) => void
}
