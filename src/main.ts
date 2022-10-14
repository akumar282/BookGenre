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
const csvData : any[] = []
const structStore: GenreWordPoints[] = [];

(async () => {
  fs.createReadStream('sample_genre_keyword_value.csv').pipe(parse({ delimiter: ',' }))
    .on('data', function (csvrow) {
      csvData.push(csvrow)
    }).on('end', function () {
      const tempStruct: GenreWordPoints = {}
      for (const ind of csvData) {
        tempStruct.genre = ind[0]
        tempStruct.keyword = ind[1]
        tempStruct.points = +ind[2]
        structStore.push(tempStruct)
        console.log(tempStruct)
      }
    })
})()

function parseCSV (file:string) {
  const csvData : any[] = []
  return new Promise(function (resolve, reject) {
    fs.createReadStream(file)
      .pipe(
        parse({
          delimiter: ','
        })
      )
      .on('data', async (csvrow) => {
        csvData.push(csvrow)
      })
      .on('end', async () => {
        const tempStruct: GenreWordPoints = {}
        for (const ind of csvData) {
          tempStruct.genre = ind[0]
          tempStruct.keyword = ind[1]
          tempStruct.points = +ind[2]
          structStore.push(tempStruct)
          console.log(tempStruct)
        }
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

for (const i of info) {
  i.description = i.description.replace(/-/g, ' ')
  i.description = i.description.replace(/[^a-z0-9 ]/gi, '')
}

console.log(structStore[1])
