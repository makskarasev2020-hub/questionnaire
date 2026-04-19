import httpClient from '../../httpClient';

export default function useFetchItems(cb) {
    async function fetchItems(pathUrl) {
        const { data } = await httpClient.get(
            `https://promedcs.ursosan.ru/${pathUrl}`,
        );
        const additionalItems = [];
        const items = data.map(item => {
            const keys = Object.keys(item);
            if (keys.length > 2) {
                const additionalKey = keys.filter(k => k !== 'id' && k !== 'name')[0];
                additionalItems.push({ [item.name]: item[additionalKey] });
            }
            return {
                name: item.name,
                id: item.id,
            };
        });
        return {
            items,
            additionalItems,
        };
    }
    return [fetchItems];
}
