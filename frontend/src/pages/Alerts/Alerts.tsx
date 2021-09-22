import Alert from '@components/Alert/Alert';
import PersonalNotificationButton from '@components/Header/components/PersonalNotificationButton/PersonalNotificationButton';
import { getSlackUrl } from '@components/Header/components/PersonalNotificationButton/utils/utils';
import { useParams } from '@util/react-router/useParams';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import LeadAlignLayout from '../../components/layout/LeadAlignLayout';
import layoutStyles from '../../components/layout/LeadAlignLayout.module.scss';
import { useGetAlertsPagePayloadQuery } from '../../graph/generated/hooks';
import { AlertConfigurationCard } from './AlertConfigurationCard/AlertConfigurationCard';
import styles from './Alerts.module.scss';

export enum ALERT_TYPE {
    Error,
    FirstTimeUser,
    UserProperties,
    TrackProperties,
    SessionFeedbackComment,
}

const ALERT_CONFIGURATIONS = [
    {
        name: 'Errors',
        canControlThreshold: true,
        type: ALERT_TYPE.Error,
    },
    {
        name: 'New Users',
        canControlThreshold: false,
        type: ALERT_TYPE.FirstTimeUser,
        description:
            'Get alerted when a new user starts their first journey in your application.',
    },
    {
        name: 'Identified Users',
        canControlThreshold: false,
        type: ALERT_TYPE.UserProperties,
        description:
            'Get alerted when users you want to track record a session.',
    },
    {
        name: 'Track Events',
        canControlThreshold: false,
        type: ALERT_TYPE.TrackProperties,
        description: 'Get alerted when an action is done in your application.',
    },
    {
        name: 'Session Feedback Comments',
        canControlThreshold: false,
        type: ALERT_TYPE.SessionFeedbackComment,
        description:
            'Get alerted when a user submits a session feedback comment.',
    },
];

const AlertsPage = () => {
    const { project_id } = useParams<{ project_id: string }>();
    const { data, loading } = useGetAlertsPagePayloadQuery({
        variables: { project_id },
    });

    const slackUrl = getSlackUrl('Organization', project_id, 'alerts');

    return (
        <LeadAlignLayout>
            <h2>Configure Your Alerts</h2>
            <p className={layoutStyles.subTitle}>
                Configure the environments you want alerts for.
            </p>
            {!loading && (
                <Alert
                    trackingId="AlertPageSlackBotIntegration"
                    message={
                        !data?.is_integrated_with_slack
                            ? "Slack isn't connected"
                            : "Can't find a Slack channel or person?"
                    }
                    type={!data?.is_integrated_with_slack ? 'error' : 'info'}
                    description={
                        <>
                            {!data?.is_integrated_with_slack ? (
                                <>
                                    Highlight needs to be connected with Slack
                                    in order to send you and your team messages.
                                    <PersonalNotificationButton
                                        text="Connect Highlight with Slack"
                                        className={styles.integrationButton}
                                        type="Organization"
                                    />
                                </>
                            ) : (
                                <>
                                    Channels created and people joined after the
                                    last Highlight and Slack sync will not show
                                    up automatically.
                                    <PersonalNotificationButton
                                        text="Sync Highlight with Slack"
                                        className={styles.integrationButton}
                                        type="Organization"
                                    />
                                </>
                            )}
                        </>
                    }
                    className={styles.integrationAlert}
                />
            )}

            <div className={styles.configurationContainer}>
                {loading ? (
                    Array(2)
                        .fill(0)
                        .map((_, index) => (
                            <Skeleton
                                key={index}
                                style={{
                                    width: '648px',
                                    height: 79,
                                    borderRadius: 8,
                                }}
                            />
                        ))
                ) : (
                    <>
                        {/* {ALERT_CONFIGURATIONS.map((configuration) => (
                            <AlertConfigurationCard
                                key={configuration.name}
                                configuration={configuration}
                                environmentOptions={
                                    data?.environment_suggestion || []
                                }
                                channelSuggestions={
                                    data?.slack_channel_suggestion || []
                                }
                            />
                        ))} */}
                        <AlertConfigurationCard
                            configuration={ALERT_CONFIGURATIONS[4]}
                            alert={
                                data?.session_feedback_alert
                                    ? data?.session_feedback_alert
                                    : {}
                            }
                            environmentOptions={
                                data?.environment_suggestion || []
                            }
                            channelSuggestions={
                                data?.slack_channel_suggestion || []
                            }
                            slackUrl={slackUrl}
                        />
                        <AlertConfigurationCard
                            configuration={ALERT_CONFIGURATIONS[0]}
                            alert={data?.error_alert ? data?.error_alert : {}}
                            environmentOptions={
                                data?.environment_suggestion || []
                            }
                            channelSuggestions={
                                data?.slack_channel_suggestion || []
                            }
                            slackUrl={slackUrl}
                        />
                        <AlertConfigurationCard
                            configuration={ALERT_CONFIGURATIONS[1]}
                            alert={
                                data?.new_user_alert ? data?.new_user_alert : {}
                            }
                            environmentOptions={
                                data?.environment_suggestion || []
                            }
                            channelSuggestions={
                                data?.slack_channel_suggestion || []
                            }
                            slackUrl={slackUrl}
                        />
                        <AlertConfigurationCard
                            configuration={ALERT_CONFIGURATIONS[2]}
                            alert={
                                data?.user_properties_alert
                                    ? data?.user_properties_alert
                                    : {}
                            }
                            environmentOptions={
                                data?.environment_suggestion || []
                            }
                            channelSuggestions={
                                data?.slack_channel_suggestion || []
                            }
                            slackUrl={slackUrl}
                        />
                        <AlertConfigurationCard
                            configuration={ALERT_CONFIGURATIONS[3]}
                            alert={
                                data?.track_properties_alert
                                    ? data?.track_properties_alert
                                    : {}
                            }
                            environmentOptions={
                                data?.environment_suggestion || []
                            }
                            channelSuggestions={
                                data?.slack_channel_suggestion || []
                            }
                            slackUrl={slackUrl}
                        />
                    </>
                )}
            </div>
        </LeadAlignLayout>
    );
};

export default AlertsPage;
