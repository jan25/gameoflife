# Game of Life

Conway's Game of Life implemented using React and p5.

See it here [jan25.github.io/gameoflife](https://jan25.github.io/gameoflife/)

By default the universe shows Gosper glider pattern, which is a pattern generating gliders indefinitely. And the grid is interactive to create your own patterns.

```
Desktop:
Space-bar               to pause or continue evolution
Mouse click or drag     to make cells alive during pause

Mobile:
touch or touch-drag     to pause and draw pattern
second touch            to resume evolution
```

## Rules of the Universe if you didn't know already!

1. Each cell in universe is either Alive or Dead
2. If a cell is Alive -
   1. If the cell has 1 or no neighbors, it dies of loneliness
   2. If the cell has 4 or more neighbors, it dies because of crowd
   3. If the cell has 2 or 3 neighbors, it will continue to stay Alive
3. If a cell is Dead -
   1. It will come to life if it has exactly 3 neighbors

## Misc

- Conway eating nuts https://www.youtube.com/watch?v=E8kUJL04ELA
- https://www.princeton.edu/news/2020/04/14/mathematician-john-horton-conway-magical-genius-known-inventing-game-life-dies-age
