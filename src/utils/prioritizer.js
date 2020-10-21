class Prioritizer {
  constructor(items, update) {
    this.items = items
    this.ranked = [this.items[0]]
    this.current = 1
    this.middle = 0
    this.min = -1
    this.max = 1
    this.done = false
    this.update = update
  }

  promptUser() {
    this.update((n) => !n)
  }

  setMiddle() {
    this.middle = Math.floor((this.min + this.max) / 2)
  }

  insertItem(item, index) {
    this.ranked.splice(index, 0, item)
  }

  onClickCurrent() {
    this.min = this.middle + 1
    if (this.min === this.max) {
      this.insertItem(this.items[this.current], this.min)
      if (this.ranked.length === this.items.length) {
        this.done = true
        this.promptUser()
        return
      }
      this.current++
      this.min = 0
      this.max = this.ranked.length - 1
    }
    this.setMiddle()
    this.promptUser()
  }

  onClickMiddle() {
    this.max = this.middle
    if (this.min === this.max || this.min === -1) {
      this.insertItem(this.items[this.current], this.max)
      if (this.ranked.length === this.items.length) {
        this.done = true
        this.promptUser()
        return
      }
      this.current++
      this.min = 0
      this.max = this.ranked.length - 1
    }
    this.setMiddle()
    this.promptUser()
  }
}

export default Prioritizer
