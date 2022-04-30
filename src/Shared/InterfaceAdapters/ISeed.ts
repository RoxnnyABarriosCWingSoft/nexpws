
interface ISeed<T = any>
{
    init(): Promise<T>
}

export default ISeed;
