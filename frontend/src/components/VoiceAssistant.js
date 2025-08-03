import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNote } from '../redux/noteSlice';
import 'bootstrap/dist/css/bootstrap.min.css';

const VoiceAssistant = () => {
    const dispatch = useDispatch();
    const note = useSelector(state => state.note.content);
    const status = useSelector(state => state.note.status);
    const error = useSelector(state => state.note.error);
    const utteranceRef = useRef(null);

    const handleReadNote = async () => {
        const result = await dispatch(fetchNote());
        if (fetchNote.fulfilled.match(result)) {
            // Combine both messages
            const fullMessage = `Sure, reading your last progress note now. ${result.payload}`;
            const utterance = new SpeechSynthesisUtterance(fullMessage);
            utteranceRef.current = utterance;

            speechSynthesis.cancel(); // Stop previous if speaking
            speechSynthesis.speak(utterance);
        }
    };

    const handlePause = () => {
        if (speechSynthesis.speaking && !speechSynthesis.paused) {
            speechSynthesis.pause();
        }
    };

    const handleResume = () => {
        if (speechSynthesis.paused) {
            speechSynthesis.resume();
        }
    };

    const handleStop = () => {
        speechSynthesis.cancel();
        utteranceRef.current = null;
    };

    return (
        <div className="container mt-5 p-4 shadow rounded bg-light">
            <h2 className="text-center mb-4 text-primary">📢 CRM Voice Assistant</h2>

            <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
                <button className="btn btn-success" onClick={handleReadNote}>🔊 Read Note</button>
                <button className="btn btn-warning" onClick={handlePause}>⏸ Pause</button>
                <button className="btn btn-info" onClick={handleResume}>▶️ Resume</button>
                {/* <button className="btn btn-danger" onClick={handleStop}>⏹ Stop</button> */}
            </div>

            {status === 'loading' && <p className="text-center text-secondary">Fetching progress note...</p>}
            {error && <p className="text-danger text-center">Error: {error}</p>}
            {note && (
                <div className="alert alert-primary">
                    <strong>Assistant:</strong> {note}
                </div>
            )}
        </div>
    );
};

export default VoiceAssistant;
