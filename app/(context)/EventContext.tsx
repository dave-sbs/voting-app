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
    getLastGeneralMeetingEvent, 
    getLastBoardMeetingEvent,
    getOpenEvents,
    insertNewEvent,
    terminateOpenEvent,
} from "@/scripts/API/eventsAPI";

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
    fetchOpenEvents: () => Promise<null>;
    checkInEvent: (event: Event) => Promise<void>;
    getLastGeneralMeeting: () => Promise<Event[] | null>;
    getLastBoardMeeting: () => Promise<Event[] | null>;
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
 * getLastGeneralMeeting: Function to fetch last general meeting details
 * getLastBoardMeeting: Function to fetch last board meeting details
 * addEvent: Function to add a new event
 * closeEvent: Function to close an open event
 */
const EventContext = createContext<EventContextProps>({
    events: null,
    currEvent: null,
    isLoading: false,
    error: null,
    fetchOpenEvents: async() => null, 
    checkInEvent: async() => undefined,
    getLastGeneralMeeting: async() => null,
    getLastBoardMeeting: async() => null,
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
            return null;
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to fetch events');
            return null;
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
     * GET LAST GENERAL MEETING
     * ---------------------------
     * 
     * Fetches details of the last general meeting
     * @returns {Promise<Event[] | null>}
     */
    const getLastGeneralMeeting = useCallback(async (): Promise<Event[] | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getLastGeneralMeetingEvent();
            return result;
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to fetch last general meeting details');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * ---------------------------
     * GET LAST BOARD MEETING
     * ---------------------------
     * 
     * Fetches details of the last board meeting
     * @returns {Promise<Event[] | null>}
     */
    const getLastBoardMeeting = useCallback(async (): Promise<Event[] | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getLastBoardMeetingEvent();
            return result;
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to fetch last board meeting details');
            return null;
        } finally {
            setIsLoading(false);
        }
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
  }, []);


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
            console.log(event.event_name)
            await terminateOpenEvent(event.event_name);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to close event');
        } finally {
            setIsLoading(false);
        }
    }, []);

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
                getLastGeneralMeeting,
                getLastBoardMeeting,
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
