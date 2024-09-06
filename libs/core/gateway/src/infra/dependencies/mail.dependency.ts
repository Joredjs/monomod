import { IMailClient } from '@nxms/core-main/domain';
import nodemailer from 'nodemailer';

export const clientMailer: IMailClient = {
	client: nodemailer,
};
