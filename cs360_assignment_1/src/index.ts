/**
* @fileOverview
 * @author
*
*
* */

import * as express from 'express';
import * as db from './TranscriptManager';
const app = express();
const port = 4001;
app.listen(port, () => {
    console.log('Listening on port', port);
})