import { apiPost, BaseBooksApiImpl } from '@apis/base_api';
import { Book } from '@models/book.model';
import { HardcoverBookDocument, HardcoverSearchResponse } from './models/hardcover_books_response';

const HARDCOVER_GRAPHQL_URL = 'https://api.hardcover.app/v1/graphql';
const MAX_RESULTS = 20;

const SEARCH_QUERY = `
  query SearchBooks($query: String!, $perPage: Int!) {
    search(query: $query, query_type: "Book", per_page: $perPage) {
      results
    }
  }
`;

export class HardcoverBooksApi implements BaseBooksApiImpl {
  constructor(private readonly apiKey: string) {}

  async getByQuery(query: string): Promise<Book[]> {
    try {
      const response = await apiPost<HardcoverSearchResponse>(
        HARDCOVER_GRAPHQL_URL,
        {
          query: SEARCH_QUERY,
          variables: { query, perPage: MAX_RESULTS },
        },
        { Authorization: `Bearer ${this.apiKey}` },
      );

      const hits = response?.data?.search?.results?.hits;
      if (!hits?.length) return [];
      return hits.map(hit => this.createBookItem(hit.document));
    } catch (error) {
      console.warn(error);
      throw error;
    }
  }

  private extractAuthors(doc: HardcoverBookDocument): string[] {
    return doc.contributions?.map(c => c.author?.name).filter(Boolean) ?? [];
  }

  private sanitizeDescription(text: string): string {
    return (text ?? '')
      .replace(/[\r\n]+/g, ' ')
      .replace(/["':;]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private createBookItem(doc: HardcoverBookDocument): Book {
    const authors = this.extractAuthors(doc);
    const coverUrl = doc.image?.url ?? '';

    return {
      title: doc.title ?? '',
      subtitle: '',
      author: authors.join(', '),
      authors,
      category: doc.genres?.join(', ') ?? '',
      categories: doc.genres ?? [],
      publisher: '',
      publishDate: doc.release_date ?? '',
      totalPage: doc.pages ?? '',
      coverUrl,
      coverSmallUrl: '',
      coverMediumUrl: '',
      coverLargeUrl: coverUrl,
      description: this.sanitizeDescription(doc.description ?? ''),
      link: doc.slug ? `https://hardcover.app/books/${doc.slug}` : '',
      previewLink: '',
    };
  }
}
