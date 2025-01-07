/* Import { AppValidations, NoValidations } from './security';
import {
	IAppValidations,
	IController,
	IFrameworkService,
	IRequestParams,
	IResponseParams,
	IServices,
	TControllers,
	TMyModulesInstances,
} from '@monomod/core/domain';
import { modulesList, modulos } from '../domain';
import { normalizeError } from '@monomod/core/application';
import { PortControllers } from './controllers.port';

jest.mock('./security');
jest.mock('@monomod/core/application', () => ({
	normalizeError: jest.fn((error) => error),
}));
describe('PortControllers', () => {
	let frameworkService: IFrameworkService<any>,
		modulesInstances: TMyModulesInstances,
		portControllers: PortControllers<any, any>;
	beforeEach(() => {
		frameworkService = {
			returnInfo: jest.fn(),
		} as unknown as IFrameworkService<any>;
		modulesInstances = {
			example: {
				Controller: jest.fn(),
				Port: jest.fn(),
				Route: jest.fn(),
			},
		};
		// PortControllers = new PortControllers(frameworkService, modulesInstances);
	});
	it('should create an instance of PortControllers', () => {
		expect(portControllers).toBeTruthy();
	});
	it('should create a controller instance with AppValidations', () => {
		const module = 'example';
		const services = {} as IServices;
		modulos[module].useValidations = true;

		const controller = portControllers.createController(module, services);

		expect(AppValidations).toHaveBeenCalledWith(services);
		expect(modulesInstances[module].Controller).toHaveBeenCalledWith(
			expect.any(AppValidations),
			frameworkService
		);
		expect(controller).toBeInstanceOf(modulesInstances[module].Controller);
	});
	it('should create a controller instance with NoValidations', () => {
		const module = 'example';
		const services = {} as IServices;
		modulos[module].useValidations = false;

		const controller = portControllers.createController(module, services);

		expect(NoValidations).toHaveBeenCalledWith(services);
		expect(modulesInstances[module].Controller).toHaveBeenCalledWith(
			expect.any(NoValidations),
			frameworkService
		);
		expect(controller).toBeInstanceOf(modulesInstances[module].Controller);
	});
	it('should get all controllers', () => {
		const services = {} as IServices;
		const controllers = portControllers.getAll(services);
		expect(controllers).toEqual({
			example: expect.any(Function),
		});
	});
	it('should throw an error if module instance does not exist', () => {
		const services = {} as IServices;
		modulesList.push('example');
		expect(() => portControllers.getAll(services)).toThrowError(
			'The module instace doesn´t exists.'
		);
	});
});
 */

describe('PortControllers', () => {
	it('should do nothing', () => {
		// This test intentionally does nothing
	});
});
