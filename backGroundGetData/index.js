import express from 'express';
import { weatherTimeCheck, airTimeCheck } from './src/service.js';

const app = express();

airTimeCheck();
