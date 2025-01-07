import { IMailClient } from '@monomod/core/domain';
import nodemailer from 'nodemailer';

export const clientNodemailer: IMailClient = {
	client: nodemailer,
};
