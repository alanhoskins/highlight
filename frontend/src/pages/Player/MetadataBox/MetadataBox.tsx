import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar } from '../../../components/Avatar/Avatar';
import { ReactComponent as FilledStarIcon } from '../../../static/star-filled.svg';
import { ReactComponent as StarIcon } from '../../../static/star.svg';

import styles from './MetadataBox.module.scss';
import { DemoContext } from '../../../DemoContext';
import {
    useGetSessionQuery,
    useMarkSessionAsStarredMutation,
} from '../../../graph/generated/hooks';
import Skeleton from 'react-loading-skeleton';
import { message } from 'antd';
import classNames from 'classnames';
import { getMajorVersion } from './utils/utils';

export const MetadataBox = () => {
    const { session_id } = useParams<{ session_id: string }>();
    const { demo } = useContext(DemoContext);

    const { loading, data } = useGetSessionQuery({
        variables: {
            id: demo ? process.env.REACT_APP_DEMO_SESSION ?? '0' : session_id,
        },
        context: { headers: { 'Highlight-Demo': demo } },
    });
    const [markSessionAsStarred] = useMarkSessionAsStarredMutation({
        update(cache) {
            cache.modify({
                fields: {
                    session(existingSession) {
                        const updatedSession = {
                            ...existingSession,
                            starred: !existingSession.starred,
                        };
                        return updatedSession;
                    },
                },
            });
        },
    });
    const created = new Date(data?.session?.created_at ?? 0);

    return (
        <div className={styles.locationBox}>
            <>
                <div
                    className={styles.starIconWrapper}
                    onClick={() => {
                        markSessionAsStarred({
                            variables: {
                                id: session_id,
                                starred: !data?.session?.starred,
                            },
                        })
                            .then(() => {
                                message.success('Updated session status!', 3);
                            })
                            .catch(() => {
                                message.error(
                                    'Error updating session status!',
                                    3
                                );
                            });
                    }}
                >
                    {data?.session?.starred ? (
                        <FilledStarIcon className={styles.starredIcon} />
                    ) : (
                        <StarIcon className={styles.unstarredIcon} />
                    )}
                </div>
                <div className={styles.userAvatarWrapper}>
                    {loading ? (
                        <Skeleton circle={true} height={36} width={36} />
                    ) : (
                        <Avatar
                            style={{ width: 36 }}
                            seed={data?.session?.identifier ?? ''}
                        />
                    )}
                </div>
                <div className={styles.userContentWrapper}>
                    <div className={styles.headerWrapper}>
                        {loading ? (
                            <Skeleton
                                count={2}
                                style={{ height: 20, marginBottom: 5 }}
                            />
                        ) : (
                            <>
                                <div className={styles.userIdHeader}>
                                    {data?.session?.identifier ||
                                        `User#${data?.session?.user_id}`}
                                </div>
                                <div className={styles.userIdSubHeader}>
                                    {created.toLocaleString('en-us', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        timeZoneName: 'short',
                                        weekday: 'long',
                                    })}
                                </div>
                                <div className={styles.userIdSubHeader}>
                                    {loading ? (
                                        <>
                                            <Skeleton
                                                count={3}
                                                style={{
                                                    height: 15,
                                                    marginBottom: 5,
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            {data?.session?.browser_name && (
                                                <div
                                                    className={classNames(
                                                        styles.userText,
                                                        styles.deviceDetails
                                                    )}
                                                >
                                                    <span>
                                                        {
                                                            data?.session
                                                                .browser_name
                                                        }{' '}
                                                        {getMajorVersion(
                                                            data?.session
                                                                .browser_version
                                                        )}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {data?.session.os_name}{' '}
                                                        {getMajorVersion(
                                                            data?.session
                                                                .os_version
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </>
        </div>
    );
};
