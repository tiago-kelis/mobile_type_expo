console.log('1 - início');

import express from 'express';
console.log('2 - express');

import { initDatabase } from '../backend/src/config/database';
console.log('3 - database importado');

async function main() {
  console.log('4 - main iniciou');
  try {
    await initDatabase();
    console.log('5 - banco ok');
  } catch (e: any) {
    console.error('5 - banco ERRO:', e.message);
  }
  console.log('6 - fim');
}

main();