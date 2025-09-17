import {Transcript} from "./types"
import {remoteGet} from "./remoteService";
export async function getTranscript() {
    let arr =await remoteGet('transcript');
}