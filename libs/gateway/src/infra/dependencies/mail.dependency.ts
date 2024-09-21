import { IMailClient } from '@nxms/core/domain';
import nodemailer from 'nodemailer';

export const clientMailer: IMailClient = {
	client: nodemailer,
};
