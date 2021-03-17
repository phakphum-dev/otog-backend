import { REFRESHTOKEN_REPOSITORY } from 'src/core/constants';
import { RefreshToken } from 'src/entities/refreshToken.entity';

export const authProvider = [
  {
    provide: REFRESHTOKEN_REPOSITORY,
    useValue: RefreshToken,
  },
];
