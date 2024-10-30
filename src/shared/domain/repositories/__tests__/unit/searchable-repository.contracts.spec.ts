import {
  SearchParams,
  SearchResult,
} from '../../searchable-repository.contracts';

describe('Searchable Repository unit tests', () => {
  describe('SearchParams tests', () => {
    it('page prop', () => {
      const sut = new SearchParams();

      expect(sut.page).toBe(1);

      const params = [
        { page: null as any, expected: 1 },
        { page: undefined as any, expected: 1 },
        { page: '' as any, expected: 1 },
        { page: 'test' as any, expected: 1 },
        { page: 0 as any, expected: 1 },
        { page: -1 as any, expected: 1 },
        { page: 5.5 as any, expected: 1 },
        { page: true as any, expected: 1 },
        { page: false as any, expected: 1 },
        { page: {} as any, expected: 1 },
        { page: 1 as any, expected: 1 },
        { page: 2 as any, expected: 2 },
      ];

      params.forEach(param => {
        const { page } = new SearchParams({ page: param.page });
        expect(page).toBe(param.expected);
      });
    });

    it('perPage prop', () => {
      const sut = new SearchParams();

      expect(sut.perPage).toBe(15);

      const params = [
        { perPage: null as any, expected: 15 },
        { perPage: undefined as any, expected: 15 },
        { perPage: '' as any, expected: 15 },
        { perPage: 'test' as any, expected: 15 },
        { perPage: 0 as any, expected: 15 },
        { perPage: -1 as any, expected: 15 },
        { perPage: 5.5 as any, expected: 15 },
        { perPage: true as any, expected: 15 },
        { perPage: false as any, expected: 15 },
        { perPage: {} as any, expected: 15 },
        { perPage: 1, expected: 1 },
        { perPage: 2, expected: 2 },
        { perPage: 25, expected: 25 },
      ];

      params.forEach(param => {
        const { perPage } = new SearchParams({ perPage: param.perPage });
        expect(perPage).toBe(param.expected);
      });
    });

    it('sort prop', () => {
      const sut = new SearchParams();

      expect(sut.sort).toBeNull();

      const params = [
        { sort: null as any, expected: null },
        { sort: undefined as any, expected: null },
        { sort: '' as any, expected: null },
        { sort: 'test' as any, expected: 'test' },
        { sort: 0 as any, expected: '0' },
        { sort: -1 as any, expected: '-1' },
        { sort: 5.5 as any, expected: '5.5' },
        { sort: true as any, expected: 'true' },
        { sort: false as any, expected: 'false' },
        { sort: {} as any, expected: '[object Object]' },
        { sort: 1, expected: '1' },
        { sort: 2, expected: '2' },
        { sort: 25, expected: '25' },
      ];

      params.forEach(param => {
        const { sort } = new SearchParams({ sort: param.sort });
        expect(sort).toBe(param.expected);
      });
    });

    it('sortDir prop', () => {
      let sut = new SearchParams();

      expect(sut.sortDir).toBeNull();

      sut = new SearchParams({ sort: null });
      expect(sut.sortDir).toBeNull();

      sut = new SearchParams({ sort: undefined });
      expect(sut.sortDir).toBeNull();

      sut = new SearchParams({ sort: '' });
      expect(sut.sortDir).toBeNull();

      const params = [
        { sortDir: null as any, expected: 'desc' },
        { sortDir: undefined as any, expected: 'desc' },
        { sortDir: '' as any, expected: 'desc' },
        { sortDir: 'test' as any, expected: 'desc' },
        { sortDir: 0 as any, expected: 'desc' },
        { sortDir: 'asc' as any, expected: 'asc' },
        { sortDir: 'desc' as any, expected: 'desc' },
        { sortDir: 'ASC' as any, expected: 'asc' },
        { sortDir: 'DESC', expected: 'desc' },
      ];

      params.forEach(param => {
        const { sortDir } = new SearchParams({
          sort: 'field',
          sortDir: param.sortDir,
        });
        expect(sortDir).toBe(param.expected);
      });
    });

    it('filter prop', () => {
      const sut = new SearchParams();

      expect(sut.filter).toBeNull();

      const params = [
        { filter: null as any, expected: null },
        { filter: undefined as any, expected: null },
        { filter: '' as any, expected: null },
        { filter: 'test' as any, expected: 'test' },
        { filter: 0 as any, expected: '0' },
        { filter: -1 as any, expected: '-1' },
        { filter: 5.5 as any, expected: '5.5' },
        { filter: true as any, expected: 'true' },
        { filter: false as any, expected: 'false' },
        { filter: {} as any, expected: '[object Object]' },
        { filter: 1, expected: '1' },
        { filter: 2, expected: '2' },
        { filter: 25, expected: '25' },
      ];

      params.forEach(param => {
        const { filter } = new SearchParams({ filter: param.filter });
        expect(filter).toBe(param.expected);
      });
    });
  });

  describe('SearchResult tests', () => {
    it('construct props', () => {
      let sut = new SearchResult({
        items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: null,
        sortDir: null,
        filter: null,
      });

      expect(sut.toJSON()).toStrictEqual({
        items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        sort: null,
        sortDir: null,
        filter: null,
      });

      sut = new SearchResult({
        items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test',
      });

      expect(sut.toJSON()).toStrictEqual({
        items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 2,
        lastPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test',
      });

      sut = new SearchResult({
        items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
        total: 4,
        currentPage: 1,
        perPage: 10,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test',
      });

      expect(sut.lastPage).toBe(1);

      sut = new SearchResult({
        items: ['teste1', 'teste2', 'teste3', 'teste4'] as any,
        total: 54,
        currentPage: 1,
        perPage: 10,
        sort: 'name',
        sortDir: 'asc',
        filter: 'test',
      });

      expect(sut.lastPage).toBe(6);
    });
  });
});
