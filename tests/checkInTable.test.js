import { createNewCheckIn } from "../scripts/table_functions/checkInTableFunctions";

describe('Check In Management', () => {
  it('should fail to insert a new check in with empty parameters', async () => {
    const { data, error } = await createNewCheckIn({
      memberId: '',
    });

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });

  it('should insert a new check in', async () => {
    const { data, error } = await createNewCheckIn({
      memberId: '012c42d4-7ca7-47ee-9c5c-2475e9b77256',
    }); 

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('should fail to insert a new check in with invalid member ID', async () => {
    const { data, error } = await createNewCheckIn({
      memberId: 'invalid-member-id',
    });

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });   
});

