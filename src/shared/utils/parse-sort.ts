export class ParseSort {
  private dir: 'asc' | 'desc'
  private label: string

  constructor(_sort?: string) {
    if (_sort) {
      this.dir = _sort.startsWith('-') ? 'desc' : 'asc'
      this.label = _sort.startsWith('-') ? _sort.substring(1) : _sort
    } else {
      this.dir = 'asc'
      this.label = 'createdAt'
    }
  }

  public object() {
    return {
      [this.label]: this.dir,
    }
  }
}

export class ParseSortForAggregation {
  private dir: 1 | -1
  private label: string

  constructor(_sort?: string) {
    if (_sort) {
      this.dir = _sort.startsWith('-') ? -1 : 1
      this.label = _sort.startsWith('-') ? _sort.substring(1) : _sort
    } else {
      this.dir = 1
      this.label = 'createdAt'
    }
  }

  public object() {
    return {
      [this.label]: this.dir,
    }
  }
}
