import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

export const users = [...Array(24)].map((_, index) => ({
  id: faker.string.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: faker.person.fullName(),
  company: 'T' + `${index + 1}` + '-TXX',
  isVerified: faker.datatype.boolean(),
  status: sample(['running', 'nav']),
  role: sample([
    'Trainer',
    'Trainees',
  ]),
}));
