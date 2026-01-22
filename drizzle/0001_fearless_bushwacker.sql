CREATE TABLE `appointmentSlots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`isAvailable` enum('true','false') NOT NULL DEFAULT 'true',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `appointmentSlots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`advisorId` int,
	`motorcycleId` int,
	`appointmentDate` timestamp NOT NULL,
	`status` enum('pending','confirmed','completed','cancelled','no_show') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chatMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL DEFAULT (now()),
	`totalConversations` int NOT NULL DEFAULT 0,
	`totalAppointmentsScheduled` int NOT NULL DEFAULT 0,
	`totalAppointmentsCompleted` int NOT NULL DEFAULT 0,
	`totalClientsCreated` int NOT NULL DEFAULT 0,
	`averageConversationLength` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMetrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`whatsappPhone` varchar(20) NOT NULL,
	`name` varchar(255),
	`email` varchar(320),
	`phone` varchar(20),
	`budget` int,
	`interests` text,
	`usageType` varchar(100),
	`conversationState` enum('initial','gathering_info','recommending','scheduling','completed') NOT NULL DEFAULT 'initial',
	`lastMessageAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_whatsappPhone_unique` UNIQUE(`whatsappPhone`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`messageType` varchar(50) NOT NULL,
	`senderType` varchar(50) NOT NULL,
	`content` text NOT NULL,
	`metadata` text,
	`whatsappMessageId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `motorcycles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`model` varchar(255) NOT NULL,
	`price` int NOT NULL,
	`batteryCapacity` varchar(100),
	`range` varchar(100),
	`maxSpeed` int,
	`chargingTime` varchar(100),
	`weight` int,
	`description` text,
	`imageUrl` text,
	`category` varchar(100),
	`isActive` enum('true','false') NOT NULL DEFAULT 'true',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `motorcycles_id` PRIMARY KEY(`id`)
);
