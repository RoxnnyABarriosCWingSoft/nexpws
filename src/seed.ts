import UserSeed from './User/Infrastructure/Seeds/UserSeed';
import RoleSeed from './Role/Infrastructure/Seeds/RoleSeed';

const seeds = {
    [RoleSeed.name]: RoleSeed,
    [UserSeed.name]: UserSeed
};

export default seeds;
