import { useState, useEffect, useCallback, useRef } from 'react';
import { ActiveNotesState } from '../types/midi';

export interface UseMidiReturn {
  activeNotes: ActiveNotesState;
  isConnected: boolean;
  deviceName: string | null;
  error: string | null;
  minDetectedMidi: number;
  maxDetectedMidi: number;
  triggerSimulatedNoteOn: (midiNumber: number) => void;
  triggerSimulatedNoteOff: (midiNumber: number) => void;
  clearActiveNotes: () => void;
  rawLogs: string[];
}

export function useMidi(): UseMidiReturn {
  const [activeNotes, setActiveNotes] = useState<ActiveNotesState>({});
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawLogs, setRawLogs] = useState<string[]>([]);

  // Range tracking from Yamaha PSR-E383 or user input
  const [minDetectedMidi, setMinDetectedMidi] = useState<number>(36); // Default C2
  const [maxDetectedMidi, setMaxDetectedMidi] = useState<number>(96); // Default C7

  const midiAccessRef = useRef<MIDIAccess | null>(null);

  const addLog = useCallback((msg: string) => {
    setRawLogs(prev => [msg, ...prev.slice(0, 19)]);
  }, []);

  const handleNoteOn = useCallback((midiNumber: number, velocity: number) => {
    setActiveNotes(prev => ({
      ...prev,
      [midiNumber]: { velocity, timestamp: Date.now() },
    }));

    setMinDetectedMidi(prev => Math.min(prev, midiNumber));
    setMaxDetectedMidi(prev => Math.max(prev, midiNumber));

    addLog(`Note ON: MIDI ${midiNumber} (Vel: ${velocity})`);
  }, [addLog]);

  const handleNoteOff = useCallback((midiNumber: number) => {
    setActiveNotes(prev => {
      const next = { ...prev };
      delete next[midiNumber];
      return next;
    });

    addLog(`Note OFF: MIDI ${midiNumber}`);
  }, [addLog]);

  const parseMidiMessage = useCallback((event: MIDIMessageEvent) => {
    const data = event.data;
    if (!data || data.length < 3) return;

    const status = data[0];
    const command = status & 0xf0;
    const note = data[1];
    const velocity = data[2];

    // Status 0x90 = Note On, 0x80 = Note Off
    if (command === 0x90) {
      if (velocity > 0) {
        handleNoteOn(note, velocity);
      } else {
        // Velocity 0 equals Note Off
        handleNoteOff(note);
      }
    } else if (command === 0x80) {
      handleNoteOff(note);
    } else if (command === 0xb0 && note === 64) {
      // CC 64 = Sustain Pedal (safely handled)
      addLog(`Sustain Pedal CC64: ${velocity}`);
    }
  }, [handleNoteOn, handleNoteOff, addLog]);

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setError('Web MIDI API is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    let isSubscribed = true;

    navigator.requestMIDIAccess({ sysex: false })
      .then((access: MIDIAccess) => {
        if (!isSubscribed) return;
        midiAccessRef.current = access;

        const updateInputs = () => {
          const inputs = Array.from(access.inputs.values());
          if (inputs.length > 0) {
            setIsConnected(true);
            const primary = inputs[0];
            setDeviceName(primary.name || 'Yamaha PSR-E383 / Generic MIDI');
            setError(null);

            inputs.forEach(input => {
              input.onmidimessage = parseMidiMessage;
            });
          } else {
            setIsConnected(false);
            setDeviceName(null);
          }
        };

        updateInputs();

        access.onstatechange = () => {
          updateInputs();
        };
      })
      .catch((err: Error) => {
        if (isSubscribed) {
          setError(`MIDI Permission Denied or Access Failed: ${err.message}`);
          setIsConnected(false);
        }
      });

    return () => {
      isSubscribed = false;
      if (midiAccessRef.current) {
        midiAccessRef.current.inputs.forEach(input => {
          input.onmidimessage = null;
        });
      }
    };
  }, [parseMidiMessage]);

  const triggerSimulatedNoteOn = useCallback((midiNumber: number) => {
    handleNoteOn(midiNumber, 100);
  }, [handleNoteOn]);

  const triggerSimulatedNoteOff = useCallback((midiNumber: number) => {
    handleNoteOff(midiNumber);
  }, [handleNoteOff]);

  const clearActiveNotes = useCallback(() => {
    setActiveNotes({});
  }, []);

  return {
    activeNotes,
    isConnected,
    deviceName,
    error,
    minDetectedMidi,
    maxDetectedMidi,
    triggerSimulatedNoteOn,
    triggerSimulatedNoteOff,
    clearActiveNotes,
    rawLogs,
  };
}
