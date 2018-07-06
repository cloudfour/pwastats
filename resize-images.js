#!/usr/bin/env node

var {readdir} = require('fs');
const {promisify} = require('util')
const ls = promisify(readdir)

const main = async () => {
  const files = await ls('images')
  console.log(files)
}

main()

