import { insertOrganizationMember, getOrganizationMembers, deleteOrganizationMember } from '../scripts/table_functions/masterTableFunctions';

describe('Organization Member Management', () => {
  it('should fail to insert a new organization member with empty parameters', async () => {
    const { data, error } = await insertOrganizationMember({
      memberName: '',
      storeNumber: ''
    });

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });

  // it('should insert a new organization member', async () => {
  //   const testData = {
  //     memberName: 'John Doe',
  //     storeNumber: 'SLJG'
  //   };

  //   const { data, error } = await insertOrganizationMember(testData);

  //   expect(error).toBeNull();
  //   expect(data).toBeDefined();
  // });

  it('should fail to insert a new organization member with duplicate store number', async () => {
    const testData = {
      memberName: 'John Doe',
      storeNumber: 'SLJG'
    };

    const { data, error } = await insertOrganizationMember(testData);

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });


  it('should fail to insert a new organization member with wrong data entry', async () => {
    const testData = {
      memberName: 123,
      storeNumber: true
    };

    const { data, error } = await insertOrganizationMember(testData);

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });

  it('should handle existing organization member with valid data', async () => {
    const testData = {
      memberName: 'Taye Shegere',
      storeNumber: 'SLJG'
    };

    const { data, error } = await insertOrganizationMember(testData);

    expect(data).toBeDefined();
    expect(error).toBeNull(); 
  });

  it('should get all organization members', async () => {
    const { data, error } = await getOrganizationMembers();

    console.log(data[0]);
    expect(data).toBeDefined();
    expect(error).toBeNull();
  }); 
});
