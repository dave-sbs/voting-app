import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import CardHeader from './CardHeader';
import { getActiveCandidates } from '@/scripts/table_functions/activeCandidatesFunctions';
import { getMemberName } from '@/scripts/table_functions/masterTableFunctions';
import { removeCandidate } from '@/scripts/manageActiveCandidates';

interface Candidate {
  candidate_id: number;
  member_id: number;
  vote_count: number;
}

interface CandidateNames {
  [key: number]: string;
}
const CandidateList = () => {
  const [activeCandidates, setActiveCandidates] = useState<Candidate[]>([]);
  const [candidateNames, setCandidateNames] = useState<CandidateNames>({});

  const fetchCandidatesAndNames = async () => {
    try {
      const { data: candidates, error } = await getActiveCandidates();
      if (error) throw error;
      if (!candidates) return;

      setActiveCandidates(candidates);

      const names: CandidateNames = {};
      for (const candidate of candidates) {
        const name = await getMemberName(candidate.member_id);
        if (name) {
          names[candidate.member_id] = name;
        }
      }
      setCandidateNames(names);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  // Call the fetch function on mount
  useEffect(() => {
    fetchCandidatesAndNames();
  }, []);

  // Create a handler to remove the candidate and re-fetch
  const handleRemoveCandidate = async (memberId: number) => {
    try {
      console.log('Removing candidate with ID:', memberId);

      await removeCandidate({ memberId });

      
      // Trigger the fetch to refresh state
      await fetchCandidatesAndNames();
    } catch (error) {
      console.error('Error removing candidate:', error);
    }
  };

  return (
    <View className="bg-white w-full mt-2 flex-1">
      <CardHeader title={'Current Candidates'} />
      <FlatList
        data={activeCandidates}
        keyExtractor={(item) => item.candidate_id.toString()}
        renderItem={({ item }) => (
          <View className="px-4 flex-row items-center justify-between mb-2">
            <Text className="text-lg font-semibold">
              {candidateNames[item.member_id] ?? 'Loading...'}
            </Text>
            <TouchableOpacity onPress={() => handleRemoveCandidate(item.member_id)}>
              <Text className="text-md text-red-500">Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default CandidateList;
