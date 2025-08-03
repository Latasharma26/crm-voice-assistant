import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNote = createAsyncThunk('note/fetchNote', async () => {
    const response = await fetch('http://localhost/voice-assistant-crm/backend/get_note.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'read my last progress note' }),
    });
    const data = await response.json();
    return data.note;
});

const noteSlice = createSlice({
    name: 'note',
    initialState: {
        content: '',
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchNote.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchNote.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.content = action.payload;
            })
            .addCase(fetchNote.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default noteSlice.reducer;
