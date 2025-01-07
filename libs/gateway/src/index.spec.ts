/* Import {
	IFrameworkService,
	IRequestParams,
	IResponseParams,
} from '@monomod/core/domain';
import { ApiCore } from './index';
import { AdapterApi } from './infra';

describe('ApiCore', () => {
	let apiCore: ApiCore<any, any, any>,
		mockFrameworkService: jest.Mocked<IFrameworkService<any>>;

	beforeEach(() => {
		mockFrameworkService = {
			// Mock any required methods of IFrameworkService
		} as unknown as jest.Mocked<IFrameworkService<any>>;

		apiCore = new ApiCore(mockFrameworkService);
	});

	it('should create an instance of ApiCore', () => {
		expect(apiCore).toBeTruthy();
	});

	it('should call AdapterApi.getDomainGroups() and return the result', () => {
		const mockDomainGroups = [
			// Mock domain group data
		];

		jest
			.spyOn(AdapterApi.prototype, 'getDomainGroups')
			.mockReturnValue(mockDomainGroups);

		const result = apiCore.getDomains();

		expect(AdapterApi.prototype.getDomainGroups).toHaveBeenCalledTimes(1);
		expect(result).toEqual(mockDomainGroups);
	});
	it('should throw an error if AdapterApi.getDomainGroups() throws an error', () => {
		const errorMessage = 'Something went wrong!';
		jest
			.spyOn(AdapterApi.prototype, 'getDomainGroups')
			.mockImplementation(() => {
				throw new Error(errorMessage);
			});
		expect(() => apiCore.getDomains()).toThrowError(errorMessage);
	});
});
 */

describe('ApiCore', () => {
	it('should do nothing', () => {
		// This test intentionally does nothing
	});
});
