import type { Source, DemoMessage } from '@/types';

export const SOURCES: Source[] = [
  {
    id: 'sms',
    label: 'SMS Message',
    prefix: '[SMS]',
    placeholder: 'Paste a suspicious SMS here. e.g. "Dear customer, your SBI account is blocked..."',
    icon: 'MessageSquare',
  },
  {
    id: 'upi',
    label: 'UPI Request',
    prefix: '[UPI]',
    placeholder: 'Paste the UPI collect request or message. e.g. "Rs. 499 requested by SHOPKEEPER@okaxis..."',
    icon: 'Smartphone',
  },
  {
    id: 'voice',
    label: 'Voice / Call',
    prefix: '[CALL]',
    placeholder: 'Type what the caller said. e.g. "I am calling from the police. There is a warrant..."',
    icon: 'Phone',
  },
  {
    id: 'link',
    label: 'Website Link',
    prefix: '[LINK]',
    placeholder: 'Paste a suspicious link or message containing a URL. e.g. "http://sbi-verify.xyz/login"',
    icon: 'Link',
  },
];

export const DEMO_MESSAGES: DemoMessage[] = [
  {
    id: 'sbi-kyc',
    label: 'SBI KYC Bank Fraud',
    source: 'sms',
    text: 'Dear SBI Customer, your KYC has expired. To avoid account block, update now: http://sbi-kyc-verify.xyz/update. Do not share with anyone. -SBI',
  },
  {
    id: 'power-cutoff',
    label: 'Electricity Cutoff Threat',
    source: 'sms',
    text: 'ELECTRICITY DEPARTMENT: Your electricity will be disconnected today at 9:30pm due to unpaid bill. Contact 9876543210 immediately to restore. -BESCOM',
  },
  {
    id: 'upi-cashback',
    label: 'Fake UPI Cashback Prize',
    source: 'upi',
    text: 'Congratulations! You won Rs. 5,00,000 cashback in the Diwali Lucky Draw. Claim your prize now by accepting this collect request of Rs. 10 processing fee. Pay now to receive full amount.',
  },
  {
    id: 'digital-arrest',
    label: 'Digital Arrest Police Threat',
    source: 'voice',
    text: 'This is Inspector Sharma from Mumbai Cyber Crime. There is a legal case against you for money laundering. Stay on the line, do not disconnect, or you will be digitally arrested. We need your Aadhaar and bank details to clear your name.',
  },
];
