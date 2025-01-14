import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback
} from 'react';

import { 
    Event, 
    getOpenEvents,
    insertNewEvent,
    terminateOpenEvent,
} from "@/scripts/eventsAPI";

/**
 * ---------------------------
 * INTERFACE FOR EVENT CONTEXT PROPERTIES
 * ---------------------------
 * 
 * events: Array of events
 * currEvent: Current event
 * isLoading: Boolean for loading state
 * error: Error message
 * fetchOpenEvents: Function to fetch events
 * addEvent: Function to add a new event
 * closeEvent: Function to close an open event
 */
interface EventContextProps {
    events: Event[] | null;
    currEvent: Event | null;
    isLoading: boolean;
    error: string | null;
    fetchOpenEvents: () => Promise<void>;
    checkInEvent: (event: Event) => Promise<void>;
    addEvent: (event: Event) => Promise<Event | null>;
    closeEvent: (event: Event) => Promise<void>;
  }
  

/**
 * ---------------------------
 * CONTEXT FOR EVENT
 * ---------------------------
 * 
 * events: Array of events
 * currEvent: Current event
 * isLoading: Boolean for loading state
 * error: Error message
 * fetchOpenEvents: Function to fetch events
 * addEvent: Function to add a new event
 * closeEvent: Function to close an open event
 */
const EventContext = createContext<EventContextProps>({
    events: null,
    currEvent: null,
    isLoading: false,
    error: null,
    fetchOpenEvents: async() => undefined, 
    checkInEvent: async() => undefined,
    addEvent: async() => null,  
    closeEvent: async() => undefined, 
});


/**
 * ---------------------------
 * INTERFACE FOR EVENT PROVIDER PROPERTIES
 * ---------------------------
 * 
 * children: ReactNode
 */
interface EventProviderProps {
    children: ReactNode;
}


/**
 * ---------------------------
 * EVENT CONTEXT PROVIDER
 * ---------------------------
 * 
 * @param param0 
 * @returns 
 */
export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
    const [currEvent, setCurrEvent] = useState<Event | null>(null);
    const [events, setEvents] = useState<Event[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * ---------------------------
     * FETCH OPEN EVENTS
     * ---------------------------
     * 
     * @returns {Promise<void>}
     */
    const fetchOpenEvents = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getOpenEvents();
            setEvents(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to fetch events');
        } finally {
            setIsLoading(false);
        }
    }, []);


    /**
     * ---------------------------
     * SET CURRENT EVENT
     * ---------------------------
     * 
     * @param event
     */
    const checkInEvent = useCallback(async (event: Event) => {
        setCurrEvent(event);
    }, []);

    /**
     * ---------------------------
     * ADD EVENT
     * ---------------------------
     * 
     * Adds a new event to the database
     * @param event 
     * @returns {Promise<void>}
     */
    const addEvent = useCallback(async (event: Event): Promise<Event | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // insertNewEvent returns an array of newly created events (or throws if not created)
      const insertedEvents = await insertNewEvent(event);
      await fetchOpenEvents(); // refresh local list

      // If insertion returned something, get the first item; otherwise null
      if (insertedEvents && insertedEvents.length > 0) {
        return insertedEvents[0]; // The newly created Event
      }
      return null;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to add event');
      return null; // Return null in error case
    } finally {
      setIsLoading(false);
    }
  }, [fetchOpenEvents]);


    /**
     * ---------------------------
     * CLOSE EVENT
     * ---------------------------
     * 
     * Closes an open event
     * @param event 
     * @returns {Promise<void>}
     */
    const closeEvent = useCallback(async (event: Event) => {
        setIsLoading(true);
        setError(null);
        try {
            await terminateOpenEvent(event.event_name);
            await fetchOpenEvents();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to close event');
        } finally {
            setIsLoading(false);
        }
    }, [fetchOpenEvents]);

    useEffect(() => {
        fetchOpenEvents();
    }, [fetchOpenEvents]);

    return (
        <EventContext.Provider 
            value={{
                events,
                currEvent,
                isLoading,
                error,
                fetchOpenEvents,
                checkInEvent,
                addEvent,
                closeEvent
            }}
        >
            {children}
        </EventContext.Provider>
    );
};


export function useEventContext() {
    return useContext(EventContext);
}
