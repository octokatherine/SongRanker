function Comparison(g, l, gIndex, lIndex, clicked) {
  console.log('Comparison')
  this.greater = g
  this.lesser = l
  this.greaterIndex = gIndex
  this.lesserIndex = lIndex
  this.clicked = clicked
}

class Prioritizer {
  constructor(items, update) {
    this.items = items
    this.ranked = []
    this.comparisons = []
    this.highestIndex = 0
    this.currentIndex = 1
    this.length = this.items.length
    this.itemA = this.items[0]
    this.itemB = this.items[1]
    this.done = false
    this.update = update
  }

  display() {
    console.log('display')
    this.itemA = this.items[this.highestIndex]
    this.itemB = this.items[this.currentIndex]
    this.update((n) => !n)
  }

  greaterSearch(comps, curr, target, i) {
    console.log('greaterSearch')
    var comp,
      found = false

    while (!found && i >= 0) {
      comp = comps[i]
      if (comp.greater === curr) {
        found = comp.lesser === target || this.greaterSearch(comps, comp.lesser, target, i)
      }
      i--
    }

    return found
  }

  greaterThan(aIndex, bIndex) {
    console.log('greater than')
    return this.greaterSearch(
      this.comparisons,
      this.items[aIndex],
      this.items[bIndex],
      this.comparisons.length - 1
    )
  }

  rank(index) {
    console.log('rank')
    if (this.length <= 0) return

    this.ranked.push(this.items[index])
    this.items.splice(index, 1)
    this.highestIndex = 0
    this.currentIndex = 1
    this.length = this.items.length
  }

  displayNext() {
    console.log('displayNext')
    if (this.length < 1) {
      console.log('one')
      this.done = true
      this.update((n) => !n)
    } else if (this.currentIndex < this.length) {
      // check if a comparison can be inferred
      if (this.greaterThan(this.currentIndex, this.highestIndex)) {
        console.log('two')
        this.compare(this.currentIndex, this.highestIndex)
      } else if (this.greaterThan(this.highestIndex, this.currentIndex)) {
        console.log('three')
        this.compare(this.highestIndex, this.currentIndex)
      } else {
        console.log('four')
        this.display()
      }
    } else {
      console.log('five')
      this.rank(this.highestIndex)
      this.displayNext()
    }
  }

  compare(hIndex, lIndex, clicked) {
    console.log('compare')
    var comp = new Comparison(this.items[hIndex], this.items[lIndex], hIndex, lIndex, clicked)
    this.comparisons.push(comp)

    if (hIndex !== this.highestIndex) {
      this.highestIndex = hIndex
    }

    this.currentIndex += 1
    this.displayNext()
  }
}

export default Prioritizer
