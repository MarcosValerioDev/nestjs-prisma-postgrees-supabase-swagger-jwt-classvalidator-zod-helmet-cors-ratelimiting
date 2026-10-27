export abstract class AbstractHashService{
    abstract hash(data: string): Promise<string>;
    abstract verify(data: string, hash: string): Promise<boolean>;
}