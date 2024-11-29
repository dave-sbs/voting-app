import { supabase } from '../services/supabaseClient';
import { insertOrganizationMember, getOrganizationMembers, deleteOrganizationMember } from './userManagement';

describe('Organization Member Management', () => {
  it('should successfully insert a new organization member with valid data', async () => {
    const testData = {
      memberName: 'Taye Shegere',
      storeNumber: 'SLJG'
    };

    const { data, error } = await insertOrganizationMember(testData);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('should handle existing organization member with valid data', async () => {
    const testData = {
      memberName: 'Taye Shegere',
      storeNumber: 'SLJG'
    };

    const { data, error } = await insertOrganizationMember(testData);

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });

  it('should delete an organization member', async () => {
    const { data, error } = await deleteOrganizationMember('');
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
