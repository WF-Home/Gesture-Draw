import {useEffect, useRef} from 'react';
import { GestureRecognizer, FilesetResolver, GestureRecognizerResult } from '@mediapipe/tasks-vision';
import './WebcamView.css';
import { GestureType } from './GestureType';
import { drawLandmark, drawLine } from './Helper';

function WebcamView() {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gestureRecognizerRef = useRef<GestureRecognizer | null>(null);

  const HAND_CONNECTIONS: number[][] = [
    [0, 1], [1, 2], [2, 3], [3, 4],       // thumb
    [0, 5], [5, 6], [6, 7], [7, 8],       // index
    [5, 9], [9,10], [10,11], [11,12],     // middle
    [9,13], [13,14], [14,15], [15,16],    // ring
    [13,17], [17,18], [18,19], [19,20],   // pinky
    [0,17]                                // palm base
  ];


  const onResults = (results: GestureRecognizerResult) => {
    if (!webcamRef.current || !canvasRef.current) return
    const videoWidth = webcamRef.current.videoWidth;
    const videoHeight = webcamRef.current.videoHeight;
    const gesture = results.gestures[0][0];

    if (gesture.categoryName === GestureType.thumbsUp) {
        console.log(results.handedness)
    }

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    if (canvasCtx == null) throw new Error('Could not get context');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);


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
  }

  useEffect(() => {
    let running = true;

  async function init() {
      // Load WASM files
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      // Create recognizer
      gestureRecognizerRef.current = await GestureRecognizer.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
          },
          runningMode: "VIDEO",
          numHands: 2,
        }
      );


      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (!webcamRef.current) return;

      webcamRef.current.srcObject = stream;

      // ✅ wait until browser finishes attaching stream
      await new Promise<void>((resolve) => {
        webcamRef.current!.onloadedmetadata = () => resolve();
      });

      await webcamRef.current.play();

      requestAnimationFrame(detect);
    }

    const detect = async () => {
      if (!running || !webcamRef.current || !gestureRecognizerRef.current) {
        return;
      }

      const now = performance.now();

      const result: GestureRecognizerResult =
        gestureRecognizerRef.current.recognizeForVideo(
          webcamRef.current!,
          now
        );

      // ✅ Results
      if (result.gestures.length > 0) { 
        onResults(result)
      }

      requestAnimationFrame(detect);
    };

    init();

  }, [])
  return (
    <>
        <video ref={webcamRef} id="webcam" />
        <canvas ref={canvasRef} id="canvas" />
    </>
  );
}

export default WebcamView;