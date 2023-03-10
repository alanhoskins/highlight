import { Button } from '@components/Button'
import Select from '@components/Select/Select'
import { useGetLogsKeysQuery } from '@graph/hooks'
import {
	Badge,
	Box,
	Column,
	Container,
	Form,
	FormState,
	IconSolidCheveronDown,
	IconSolidCheveronRight,
	IconSolidCheveronUp,
	IconSolidSpeakerphone,
	Menu,
	PreviousDateRangePicker,
	Stack,
	Tag,
	Text,
	useForm,
	useFormState,
	useMenu,
} from '@highlight-run/ui'
import { useProjectId } from '@hooks/useProjectId'
import { useLogAlertsContext } from '@pages/Alerts/LogAlert/context'
import {
	dedupeEnvironments,
	EnvironmentSuggestion,
} from '@pages/Alerts/utils/AlertsUtils'
import { LOG_TIME_PRESETS, now, thirtyDaysAgo } from '@pages/LogsPage/constants'
import LogsHistogram from '@pages/LogsPage/LogsHistogram/LogsHistogram'
import { Search } from '@pages/LogsPage/SearchForm/SearchForm'
import { useEffect, useMemo, useState } from 'react'

import * as styles from './styles.css'

export const LogMonitorPage = () => {
	const [selectedDates, setSelectedDates] = useState([
		LOG_TIME_PRESETS[0].startDate,
		now.toDate(),
	])

	const [startDate, setStartDate] = useState(LOG_TIME_PRESETS[0].startDate)
	const [endDate, setEndDate] = useState(now.toDate())

	useEffect(() => {
		if (selectedDates.length === 2) {
			setStartDate(selectedDates[0])
			setEndDate(selectedDates[1])
		}
	}, [selectedDates])

	const form = useFormState<LogMonitorForm>({
		defaultValues: {
			query: '',
			name: '',
			belowThreshold: false,
			excludedEnvironments: [],
			slackChannels: [],
			discordChannels: [],
			emails: [],
			threshold: undefined,
			frequency: 15,
		},
	})

	const query = form.getValue(form.names.query)
	const belowThreshold = form.getValue(form.names.belowThreshold)
	const threshold = form.getValue(form.names.threshold)

	const header = useMemo(() => {
		return (
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				borderBottom="dividerWeak"
				px="8"
				py="6"
				cssClass={styles.header}
			>
				<Text userSelect="none">Create monitoring alert</Text>
				<Box display="flex" alignItems="center" gap="4">
					<Button
						kind="secondary"
						size="small"
						emphasis="low"
						trackingId="closeLogMonitoringAlert"
					>
						Cancel
					</Button>
					<Button
						kind="primary"
						size="small"
						emphasis="high"
						trackingId="saveLogMonitoringAlert"
					>
						Create alert
					</Button>
				</Box>
			</Box>
		)
	}, [])

	return (
		<Box width="full" background="raised" px="8" pb="8">
			<Box
				border="dividerWeak"
				borderRadius="6"
				width="full"
				shadow="medium"
				background="default"
				display="flex"
				flexDirection="column"
				height="full"
			>
				{header}
				<Container
					display="flex"
					flexDirection="column"
					py="24"
					gap="40"
				>
					<Box
						display="flex"
						flexDirection="column"
						width="full"
						height="full"
						gap="12"
					>
						<Box
							display="flex"
							alignItems="center"
							width="full"
							justifyContent="space-between"
						>
							<Box
								display="flex"
								alignItems="center"
								gap="4"
								color="weak"
							>
								<Tag
									kind="secondary"
									size="medium"
									shape="basic"
									emphasis="high"
									iconLeft={<IconSolidSpeakerphone />}
								>
									Alerts
								</Tag>
								<IconSolidCheveronRight />
								<Text
									color="moderate"
									size="small"
									weight="medium"
									userSelect="none"
								>
									Log monitor
								</Text>
							</Box>
							<PreviousDateRangePicker
								selectedDates={selectedDates}
								onDatesChange={setSelectedDates}
								presets={LOG_TIME_PRESETS}
								minDate={thirtyDaysAgo}
								kind="secondary"
								size="medium"
								emphasis="low"
							/>
						</Box>
						<LogsHistogram
							query={query}
							startDate={startDate}
							endDate={endDate}
							onDatesChange={(startDate, endDate) => {
								setSelectedDates([startDate, endDate])
							}}
							onLevelChange={() => {}}
							outline
							threshold={threshold}
							belowThreshold={belowThreshold}
						/>
					</Box>
					<Form state={form} resetOnSubmit={false}>
						<LogAlertForm {...{ startDate, endDate }} />
					</Form>
				</Container>
			</Box>
		</Box>
	)
}

const LogAlertForm = ({
	startDate,
	endDate,
}: {
	startDate: Date
	endDate: Date
}) => {
	const { projectId } = useProjectId()
	const { data: keysData } = useGetLogsKeysQuery({
		variables: {
			project_id: projectId,
		},
	})
	const form = useForm() as FormState<LogMonitorForm>
	const query = form.values.query

	const { alertsPayload } = useLogAlertsContext()

	const environments = dedupeEnvironments(
		(alertsPayload?.environment_suggestion ??
			[]) as EnvironmentSuggestion[],
	).map((environmentSuggestion) => ({
		displayValue: environmentSuggestion,
		value: environmentSuggestion,
		id: environmentSuggestion,
	}))

	const slackChannels = (alertsPayload?.slack_channel_suggestion ?? []).map(
		({ webhook_channel, webhook_channel_id }) => ({
			displayValue: webhook_channel!,
			value: webhook_channel_id!,
			id: webhook_channel_id!,
		}),
	)

	const discordChannels = (
		alertsPayload?.discord_channel_suggestions ?? []
	).map(({ name, id }) => ({
		displayValue: name,
		value: id,
		id: id,
	}))

	const emails = (alertsPayload?.admins ?? [])
		.map((wa) => wa.admin!.email)
		.map((email) => ({
			displayValue: email,
			value: email,
			id: email,
		}))

	return (
		<Box cssClass={styles.grid}>
			<Stack gap="12">
				<Box cssClass={styles.sectionHeader}>
					<Text size="large" weight="bold" color="strong">
						Define query
					</Text>
				</Box>
				<Box borderTop="dividerWeak" width="full" />
				<Form.NamedSection label="Search query" name={form.names.query}>
					<Box cssClass={styles.queryContainer}>
						<Search
							initialQuery={query}
							keys={keysData?.logs_keys ?? []}
							startDate={startDate}
							endDate={endDate}
							hideIcon
							className={styles.combobox}
						/>
					</Box>
				</Form.NamedSection>
			</Stack>
			<Stack gap="12">
				<Box
					cssClass={styles.sectionHeader}
					justifyContent="space-between"
				>
					<Text size="large" weight="bold" color="strong">
						Alert conditions
					</Text>
					<Menu>
						<ThresholdTypeConfiguration />
					</Menu>
				</Box>
				<Box borderTop="dividerWeak" width="full" />
				<Column.Container gap="12">
					<Column>
						<Form.Input
							name={form.names.threshold}
							type="number"
							label="Alert threshold"
							tag={
								<Badge
									shape="basic"
									variant="red"
									size="small"
									label="Red"
								/>
							}
						/>
					</Column>

					<Column>
						<Form.NamedSection
							label="Alert frequency"
							name={form.names.frequency}
						>
							<select
								className={styles.select}
								value={form.values.frequency}
								onChange={(e) =>
									form.setValue(
										form.names.frequency,
										e.target.value,
									)
								}
							>
								<option value="" disabled>
									Select alert frequency
								</option>
								<option value={15}>15 seconds</option>
								<option value={60}>1 minute</option>
								<option value={300}>5 minutes</option>
								<option value={900}>15 minutes</option>
								<option value={1800}>30 minutes</option>
							</select>
						</Form.NamedSection>
					</Column>
				</Column.Container>
			</Stack>

			<Stack gap="12">
				<Box cssClass={styles.sectionHeader}>
					<Text size="large" weight="bold" color="strong">
						General
					</Text>
				</Box>

				<Box borderTop="dividerWeak" width="full" />

				<Form.Input
					name={form.names.name}
					type="text"
					placeholder="Type alert name"
					label="Name"
				/>

				<Form.NamedSection
					label="Excluded environments"
					name={form.names.excludedEnvironments}
				>
					<Select
						aria-label="Excluded environments list"
						placeholder="Select excluded environments"
						options={environments}
						onChange={(values) =>
							form.setValue(
								form.names.excludedEnvironments,
								values,
							)
						}
						notFoundContent={<p>No environment suggestions</p>}
						className={styles.selectContainer}
						mode="multiple"
					/>
				</Form.NamedSection>
			</Stack>
			<Stack gap="12">
				<Box cssClass={styles.sectionHeader}>
					<Text size="large" weight="bold" color="strong">
						Notify team
					</Text>
				</Box>

				<Box borderTop="dividerWeak" width="full" />

				<Form.NamedSection
					label="Slack channels to notify"
					name={form.names.slackChannels}
				>
					<Select
						aria-label="Slack channels to notify"
						placeholder="Select Slack channels"
						options={slackChannels}
						onChange={(values) =>
							form.setValue(form.names.slackChannels, values)
						}
						notFoundContent={<p>No channel suggestions</p>}
						className={styles.selectContainer}
						mode="multiple"
					/>
				</Form.NamedSection>

				<Form.NamedSection
					label="Discord channels to notify"
					name={form.names.discordChannels}
				>
					<Select
						aria-label="Discord channels to notify"
						placeholder="Select Discord channels"
						options={discordChannels}
						onChange={(values) =>
							form.setValue(form.names.discordChannels, values)
						}
						notFoundContent={<p>No channel suggestions</p>}
						className={styles.selectContainer}
						mode="multiple"
					/>
				</Form.NamedSection>

				<Form.NamedSection
					label="Emails to notify"
					name={form.names.emails}
				>
					<Select
						aria-label="Emails to notify"
						placeholder="Pick emails"
						options={emails}
						onChange={(values) =>
							form.setValue(form.names.emails, values)
						}
						notFoundContent={<p>No email suggestions</p>}
						className={styles.selectContainer}
						mode="multiple"
					/>
				</Form.NamedSection>
			</Stack>
		</Box>
	)
}

const ThresholdTypeConfiguration = () => {
	const form = useForm()
	const menu = useMenu()
	const belowThreshold = form.values.belowThreshold
	return (
		<>
			<Menu.Button
				kind="secondary"
				size="small"
				emphasis="high"
				cssClass={styles.thresholdTypeButton}
				iconRight={
					menu.open ? (
						<IconSolidCheveronUp />
					) : (
						<IconSolidCheveronDown />
					)
				}
			>
				{belowThreshold ? 'Below' : 'Above'} threshold
			</Menu.Button>
			<Menu.List>
				<Menu.Item
					onClick={() => {
						form.setValue('belowThreshold', false)
					}}
				>
					Above threshold
				</Menu.Item>
				<Menu.Item
					onClick={() => {
						form.setValue('belowThreshold', true)
					}}
				>
					Below threshold
				</Menu.Item>
			</Menu.List>
		</>
	)
}

interface LogMonitorForm {
	query: string
	name: string
	belowThreshold: boolean
	threshold: number | undefined
	frequency: number
	excludedEnvironments: string[]
	slackChannels: string[]
	discordChannels: string[]
	emails: string[]
}

export default LogMonitorPage
