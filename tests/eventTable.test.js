import { insertEvent, getAllEvents, getLastBoardMeetingEvent, getLastGeneralMeetingEvent, terminateEvent } from '../scripts/table_functions/eventTableFunctions.js';

/* 
Procedure: 
- Current table is empty so, 
1. Get all events
2. Get last board meeting event
3. Get last general meeting event
4. Add new event: Make it general meeting
5. Get all events again
6. Get last board meeting event
7. Get last general meeting event
8. Add new event: Make it board meeting
9. Get all events again
10. Get last board meeting event
11. Get last general meeting event


-------

It currently allows events with the same data to be duplicated. Need to fix
If a board meeting session is already open, don't allow another one to be created. 
Same for a general meeting.
*/

describe('Event Table Management', () => {
    it('should get all events', async () => {
        const { data, error } = await getAllEvents();
        console.log(data);
        expect(data).toBeDefined();
        expect(error).toBeNull();
    });     

    it('should get last board meeting event', async () => {
        const { data, error } = await getLastBoardMeetingEvent();
        console.log(data);
        expect(data).toBeDefined();
        expect(error).toBeNull();
    });     
    
    it('should get last general meeting event', async () => {
        const { data, error } = await getLastGeneralMeetingEvent();
        console.log(data);
        expect(data).toBeDefined();
        expect(error).toBeNull();
    });     
    
    it('should add a new event', async () => {                    
        const test_data = {
            eventName: 'General Meeting',
            eventDate: new Date(),
            createdBy: 'John Doe'
        };
        const { data, error } = await insertEvent(test_data);
        expect(data).toBeDefined();
        expect(error).toBeNull();
    });     
    
    it('should get all events again', async () => {
        const { data, error } = await getAllEvents();
        expect(data).toBeDefined();
        expect(error).toBeNull();
    });     
    
    it('should get last board meeting event again', async () => {
        const { data, error } = await getLastBoardMeetingEvent();
        expect(data).toBeDefined();
        expect(error).toBeNull();
    });     
    
    it('should get last general meeting event again', async () => {
        const { data, error } = await getLastGeneralMeetingEvent();
        console.log(data);
        expect(data).toBeDefined();
        expect(error).toBeNull();
    });     
    
    it('should add a new event', async () => {                    
        const test_data = {
            eventName: 'Board Meeting',
            eventDate: new Date(),
            createdBy: 'John Doe'
        };
        const { data, error } = await insertEvent(test_data);
        expect(data).toBeDefined();
        expect(error).toBeNull();
    });     
    
    it('should get all events again', async () => {
        const { data, error } = await getAllEvents();
        expect(data).toBeDefined();
        expect(error).toBeNull();
    });     
    
    it('should get last board meeting event again', async () => {
        const { data, error } = await getLastBoardMeetingEvent();
        expect(data).toBeDefined();
        expect(error).toBeNull();
    });     
    
    it('should get last general meeting event again', async () => {
        const { data, error } = await getLastGeneralMeetingEvent();
        expect(data).toBeDefined();
        expect(error).toBeNull();
    });     

    it('should add a new event', async () => {                    
        const test_data = {
            eventName: 'AUTO',
            eventDate: new Date(),
            createdBy: 'AUTO'
        };
        const { data, error } = await insertEvent(test_data);
        expect(data).toBeDefined();
        expect(error).toBeNull();
    });    

    it('should add a new event', async () => {                    
        const test_data = {
            eventName: 'AUTO',
            eventDate: new Date(),
            createdBy: 'AUTO'
        };
        const { data, error } = await insertEvent(test_data);
        expect(data).toBeDefined();
        expect(error).toBeNull();
    });     
    
    it('should get all events again', async () => {
        const { data, error } = await getAllEvents();
        console.log(data);
        expect(data).toBeDefined();
        expect(error).toBeNull();
    });    
    
    it('should get last general meeting event again', async () => {
        const { data, error } = await getLastGeneralMeetingEvent();
        console.log(data);
        expect(data).toBeDefined();
        expect(error).toBeNull();
    });   


    it('should close the last board meeting event', async () => {
        const { data: lastBoardData, error: lastBoardError } = await getLastBoardMeetingEvent();

        expect(lastBoardError).toBeNull();
        expect(lastBoardData).toBeDefined();

        const { data, error } = await terminateEvent({
            eventName: lastBoardData[0].event_name,
            eventDate: lastBoardData[0].event_date,
            createdBy: lastBoardData[0].created_by
        });
        expect(data).toBeDefined();
        expect(error).toBeNull();        
    }); 


    it('should get all events again', async () => {
        const { data, error } = await getAllEvents();
        console.log(data);
        expect(data).toBeDefined();
        expect(error).toBeNull();
    });    
});



