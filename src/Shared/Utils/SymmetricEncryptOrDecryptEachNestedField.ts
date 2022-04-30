import SymmetricEncryptionStrategy from '../Encryption/SymmetricEncryptionStrategy';

const symmetricEncryptOrDecryptEachNestedField = <T>(
    data: any,
    option: 'encrypt' | 'decrypt',
    allowNulls = false
): T =>
{
    const response = {};

    const encrypt = (valueEncrypt: string) =>
    {
        return SymmetricEncryptionStrategy.enCrypt(valueEncrypt);
    };

    const decrypt = (valueDecrypt: string) =>
    {
        return SymmetricEncryptionStrategy.deCrypt(valueDecrypt);
    };

    const fn = {
        encrypt,
        decrypt
    };

    const isObject = (obj: any) =>
    {
        return Object.prototype.toString.call(obj) === '[object Object]';
    };

    const isArray = (array: any) =>
    {
        return Array.isArray(array);
    };

    if (!data)
    {
        return data;
    }

    if (isObject(data))
    {
        for (const field in data)
        {
            if (data[field])
            {
                const newValue = symmetricEncryptOrDecryptEachNestedField(
                    data[field],
                    option,
                    allowNulls
                );

                Object.assign(response, { [field]: newValue });
            }
            else if (allowNulls)
            {
                Object.assign(response, { [field]: null });
            }
        }
    }
    else if (isArray(data))
    {
        return (data as []).map((e) =>
        {
            return symmetricEncryptOrDecryptEachNestedField(
                e,
                option,
                allowNulls
            );
        }) as unknown as T;
    }
    else
    {
        return fn[option](String(data)) as unknown as T;
    }

    return response as T;
};


export default symmetricEncryptOrDecryptEachNestedField;
