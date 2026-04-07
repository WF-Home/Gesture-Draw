import { GestureRecognizerResult } from '@mediapipe/tasks-vision';
import { HAND_CONNECTIONS, drawLandmark, drawLine } from './Helper';

export function landmarksCanvas(canvasElement: HTMLCanvasElement, results: GestureRecognizerResult) {
    const canvasCtx = canvasElement.getContext("2d");
    if (canvasCtx == null) throw new Error('Could not get context');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.scale(-1, 1);
    canvasCtx.translate(-canvasElement.width, 0);

    if (results.landmarks.length > 0) {
        const handLandmarks = results.landmarks;

        // ✅ Draw connections
        handLandmarks.forEach( landmarks => {
        HAND_CONNECTIONS.forEach(([start, end]) => {
            const a = landmarks[start];
            const b = landmarks[end];

            drawLine(
            canvasCtx,
            a.x * canvasElement.width,
            a.y * canvasElement.height,
            b.x * canvasElement.width,
            b.y * canvasElement.height
            );
        });

        // ✅ Draw points
        landmarks.forEach((point) => {
            drawLandmark(
            canvasCtx,
            point.x * canvasElement.width,
            point.y * canvasElement.height
            );
        });
        })
    }

    canvasCtx.restore();
}