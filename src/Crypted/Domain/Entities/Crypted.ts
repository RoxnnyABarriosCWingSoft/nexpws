import ICryptedDomain from './ICryptedDomain';

class Crypted implements ICryptedDomain
{
    input: any;
    output: any;

    constructor(build: Crypted)
    {
        Object.assign(this, build);
    }
}

export default Crypted;
