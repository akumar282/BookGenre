/* eslint-disable camelcase */
import * as fs from 'fs'
import { parse } from 'csv-parse'
import sample_book_data from '../sample_book_data.json' assert { type: 'json'}

type GenreWordPoints = {
  genre: string
  keyword: string
  points: number
}

const info = sample_book_data
const resultStore : any[] = []
const structStore: GenreWordPoints[] = []

async function readFile (filePath: string) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse({ delimiter: ',' }))
      .on('data', (data) => {
        resultStore.push(data)
      })
      .on('error', (_error) => reject(resultStore))
      .on('end', () => {
        resolve(resultStore)
      })
  })
}

const filePath = 'sample_genre_keyword_value.csv'

try {
  const infoword = await readFile(filePath).then(function (result) {
  })
  // console.log(infoword + 'this?')
} catch (e) {
  console.log(e + 'this1?')
}

for (const i of info) {
  i.description = i.description.replace(/-/g, ' ')
  i.description = i.description.replace(/[^a-z0-9 ]/gi, '')
}

console.log(resultStore)

for (const i of resultStore) {
  const tempStruct: GenreWordPoints = {
    genre: i[0],
    keyword: i[1],
    points: +i[2]
  }
  structStore.push(tempStruct)
}

structStore.splice(0, 1)
console.log(structStore)
// console.log(sample_book_data)
const finalResult: GenreWordPoints[] = []
const originalPVal: number[] = []

for (const struct of structStore) {
  originalPVal.push(struct.points)
}
console.log(originalPVal)

function customFind (obj1: GenreWordPoints, place: GenreWordPoints[]): number {
  for (let i = 0; i < place.length; i++) {
    if (obj1.genre === place[i].genre && obj1.keyword === place[i].keyword) {
      return i
    }
  }
  return -1
}

for (const i of info) {
  for (let j = 0; j < structStore.length; j++) {
    const match = structStore[j].keyword
    if (i.description.includes(match)) {
      if (finalResult.find((obj) => {
        return obj.keyword === structStore[j].keyword
      })) {
        const repl: GenreWordPoints = {
          genre: structStore[j].genre,
          keyword: structStore[j].keyword,
          points: structStore[j].points + originalPVal[j]
        }
        const index = customFind(structStore[j], finalResult)
        finalResult.splice(index, 1, repl)
      } else {
        finalResult.push(structStore[j])
      }
    }
  }
}

console.log(finalResult)
