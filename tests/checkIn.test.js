import { createGeneralCheckIn } from "../scripts/table_functions/checkInTableFunctions";
import { getOrganizationMembers } from "../scripts/table_functions/masterTableFunctions";
import { getOpenEvents } from "../scripts/table_functions/eventTableFunctions";

describe('Check In Management', () => {
  it('should fail to insert a new check in with empty parameters', async () => {
    const { data, error } = await createGeneralCheckIn({
      memberId: '',
      eventId: '',
    });

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });

  it('should insert a new check in', async () => {
    const { data: eventData, error: eventError } = await getOpenEvents();
    const { data: memberData, error: memberError } = await getOrganizationMembers();

    if (eventError) {
      throw new Error('Failed to get any open events');
    }
    if (memberError) {
      throw new Error('Failed to get events or members');
    }

    const member = memberData[0];
    const event = eventData[0];

    const { data, error } = await createGeneralCheckIn({
      memberId: member.member_id,
      eventId: event.event_id
    }); 

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('should fail to insert a new check in with invalid member ID', async () => {
    const { data, error } = await createGeneralCheckIn({
      memberId: 'invalid-member-id',
      eventId: '',
    });

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });   
});

