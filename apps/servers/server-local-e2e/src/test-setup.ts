/* import {
	IPortContainer,
	IPortServerController,
	TOKENS,
} from '@monomod/core/domain';
import { ProjectRegisterServerLocal } from '@monomod/server-local/infra';
import { TestHelper } from './server-local/global';

module.exports = async () => {
	const helper = new TestHelper();
	// Cargar endpoints dinámicamente
	await helper.loadEndpoints();

	// Inicializar el servidor
	const container = new ProjectRegisterServerLocal().initialize();
	const serverController = container.resolve<IPortServerController>(
		TOKENS.server.IPortServerController
	);
	await serverController.deploy();

	const minuto = 1000;
	// Dar tiempo al servidor para iniciar
	await new Promise((resolve) => setTimeout(resolve, minuto));

	//  Guardar instancias para el teardown
	   global.__SERVER_CONTROLLER__ = serverController;
};
 */
