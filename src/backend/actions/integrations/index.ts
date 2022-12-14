import {
  HTTP_INTEGRATION_KEY,
  IActionIntegrationsImplemention,
} from "shared/types/actions";
import { HTTP_ACTION_INTEGRATION } from "./http";
import { MAIL_GUN_ACTION_INTEGRATION } from "./mailgun";
import { POST_MARK_ACTION_INTEGRATION } from "./postmark";
import { SEND_GRID_ACTION_INTEGRATION } from "./sendgrid";
import { SENDINBLUE_ACTION_INTEGRATION } from "./sendinblue";
import { SLACK_ACTION_INTEGRATION } from "./slack";
import { SMTP_ACTION_INTEGRATION } from "./smtp";
import { TWILIO_ACTION_INTEGRATION } from "./twilio";

export const ACTION_INTEGRATIONS: Record<
  string,
  IActionIntegrationsImplemention
> = {
  [HTTP_INTEGRATION_KEY]: HTTP_ACTION_INTEGRATION,
  smtp: SMTP_ACTION_INTEGRATION,
  slack: SLACK_ACTION_INTEGRATION,
  sendgrid: SEND_GRID_ACTION_INTEGRATION,
  mailgun: MAIL_GUN_ACTION_INTEGRATION,
  twilio: TWILIO_ACTION_INTEGRATION,
  postmark: POST_MARK_ACTION_INTEGRATION,
  sendInBlue: SENDINBLUE_ACTION_INTEGRATION,
  // zapier: SLACK_ACTION_INTEGRATION,
  // stripe: SLACK_ACTION_INTEGRATION,
};

// https://github.com/novuhq/novu/tree/next/providers
// MS teams
