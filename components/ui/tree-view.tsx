'use client';

import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronRight, Folder, File } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Merged CSS: applied hover and selected styles from both snippets
const treeVariants = cva(
	'group hover:bg-gray-700 px-2 py-0.5 rounded-sm transition-colors duration-200'
);

const selectedTreeVariants = cva('bg-blue-600 text-white');

// Tree Component as before
interface TreeDataItem {
	id: string;
	name: string;
	icon?: any;
	selectedIcon?: any;
	openIcon?: any;
	children?: TreeDataItem[];
	actions?: React.ReactNode;
	onClick?: () => void;
}

type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
	data: TreeDataItem[] | TreeDataItem;
	initialSelectedItemId?: string;
	onSelectChange?: (item: TreeDataItem | undefined) => void;
	expandAll?: boolean;
	defaultNodeIcon?: any;
	defaultLeafIcon?: any;
};

const TreeView = React.forwardRef<HTMLDivElement, TreeProps>(
	(
		{
			data,
			initialSelectedItemId,
			onSelectChange,
			expandAll,
			defaultLeafIcon,
			defaultNodeIcon,
			className,
			...props
		},
		ref
	) => {
		const [selectedItemId, setSelectedItemId] = React.useState<
			string | undefined
		>(initialSelectedItemId);

		const handleSelectChange = React.useCallback(
			(item: TreeDataItem | undefined) => {
				setSelectedItemId(item?.id);
				if (onSelectChange) {
					onSelectChange(item);
				}
			},
			[onSelectChange]
		);

		const expandedItemIds = React.useMemo(() => {
			if (!initialSelectedItemId) {
				return [] as string[];
			}

			const ids: string[] = [];

			function walkTreeItems(
				items: TreeDataItem[] | TreeDataItem,
				targetId: string
			) {
				if (items instanceof Array) {
					for (let i = 0; i < items.length; i++) {
						ids.push(items[i]!.id);
						if (walkTreeItems(items[i]!, targetId) && !expandAll) {
							return true;
						}
						if (!expandAll) ids.pop();
					}
				} else if (!expandAll && items.id === targetId) {
					return true;
				} else if (items.children) {
					return walkTreeItems(items.children, targetId);
				}
			}

			walkTreeItems(data, initialSelectedItemId);
			return ids;
		}, [data, expandAll, initialSelectedItemId]);

		return (
			<div className={cn('overflow-hidden relative p-2', className)}>
				<TreeItem
					data={data}
					ref={ref}
					selectedItemId={selectedItemId}
					handleSelectChange={handleSelectChange}
					expandedItemIds={expandedItemIds}
					defaultLeafIcon={defaultLeafIcon}
					defaultNodeIcon={defaultNodeIcon}
					{...props}
				/>
			</div>
		);
	}
);

TreeView.displayName = 'TreeView';

type TreeItemProps = TreeProps & {
	selectedItemId?: string;
	handleSelectChange: (item: TreeDataItem | undefined) => void;
	expandedItemIds: string[];
	defaultNodeIcon?: any;
	defaultLeafIcon?: any;
};

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
	(
		{
			className,
			data,
			selectedItemId,
			handleSelectChange,
			expandedItemIds,
			defaultNodeIcon,
			defaultLeafIcon,
			...props
		},
		ref
	) => {
		if (!(data instanceof Array)) {
			data = [data];
		}
		return (
			<div ref={ref} role='tree' className={className} {...props}>
				<ul>
					{data.map((item) => (
						<li key={item.id}>
							{item.children ? (
								<TreeNode
									item={item}
									selectedItemId={selectedItemId}
									expandedItemIds={expandedItemIds}
									handleSelectChange={handleSelectChange}
									defaultNodeIcon={defaultNodeIcon}
									defaultLeafIcon={defaultLeafIcon}
								/>
							) : (
								<TreeLeaf
									item={item}
									selectedItemId={selectedItemId}
									handleSelectChange={handleSelectChange}
									defaultLeafIcon={defaultLeafIcon}
								/>
							)}
						</li>
					))}
				</ul>
			</div>
		);
	}
);
TreeItem.displayName = 'TreeItem';

const TreeNode = ({
	item,
	handleSelectChange,
	expandedItemIds,
	selectedItemId,
	defaultNodeIcon,
	defaultLeafIcon,
}: {
	item: TreeDataItem;
	handleSelectChange: (item: TreeDataItem | undefined) => void;
	expandedItemIds: string[];
	selectedItemId?: string;
	defaultNodeIcon?: any;
	defaultLeafIcon?: any;
}) => {
	const [value, setValue] = React.useState(
		expandedItemIds.includes(item.id) ? [item.id] : []
	);
	return (
		<AccordionPrimitive.Root
			type='multiple'
			value={value}
			onValueChange={(s) => setValue(s)}
		>
			<AccordionPrimitive.Item value={item.id}>
				<AccordionTrigger
					className={cn(
						treeVariants(),
						selectedItemId === item.id && selectedTreeVariants(),
						'flex items-center cursor-pointer'
					)}
					onClick={() => {
						handleSelectChange(item);
						item.onClick?.();
					}}
				>
					{/* Icon on the left */}
					<TreeIcon
						item={item}
						isSelected={selectedItemId === item.id}
						isOpen={value.includes(item.id)}
						default={defaultNodeIcon}
					/>
					{/* Link to the folder */}
					<Link href={`/folder/${item.id}`}>
						<p className='text-white hover:underline hover:cursor-pointer'>
							{item.name?.trim() || 'Unnamed Folder'}
						</p>
					</Link>
				</AccordionTrigger>
				<AccordionContent className='ml-4 pl-1 border-l'>
					<TreeItem
						data={item.children || item}
						selectedItemId={selectedItemId}
						handleSelectChange={handleSelectChange}
						expandedItemIds={expandedItemIds}
						defaultLeafIcon={defaultLeafIcon}
						defaultNodeIcon={defaultNodeIcon}
					/>
				</AccordionContent>
			</AccordionPrimitive.Item>
		</AccordionPrimitive.Root>
	);
};

const TreeLeaf = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		item: TreeDataItem;
		selectedItemId?: string;
		handleSelectChange: (item: TreeDataItem | undefined) => void;
		defaultLeafIcon?: any;
	}
>(
	(
		{
			className,
			item,
			selectedItemId,
			handleSelectChange,
			defaultLeafIcon,
			...props
		},
		ref
	) => {
		return (
			<div
				ref={ref}
				className={cn(
					'ml-5 flex text-left items-center py-2 cursor-pointer',
					treeVariants(),
					className,
					selectedItemId === item.id && selectedTreeVariants()
				)}
				onClick={() => {
					handleSelectChange(item);
					item.onClick?.();
				}}
				{...props}
			>
				{/* Icon on the left */}
				<TreeIcon
					item={item}
					isSelected={selectedItemId === item.id}
					default={defaultLeafIcon}
				/>
				{/* Link to the folder */}
				<Link href={`/folder/${item.id}`}>
					<p className='text-white'>{item.name?.trim() || 'Unnamed Folder'}</p>
				</Link>
				{/* Actions to the right (if any) */}
				<TreeActions isSelected={selectedItemId === item.id}>
					{item.actions}
				</TreeActions>
			</div>
		);
	}
);

TreeLeaf.displayName = 'TreeLeaf';

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Header>
		<AccordionPrimitive.Trigger
			ref={ref}
			className={cn(
				'flex flex-1 w-full items-center py-2 transition-all first:[&[data-state=open]>svg]:rotate-90',
				className
			)}
			{...props}
		>
			<ChevronRight className='h-4 w-4 shrink-0 transition-transform duration-200 text-accent-foreground/50 mr-1' />
			{children}
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Content
		ref={ref}
		className={cn(
			'transition-all overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up',
			className
		)}
		{...props}
	>
		<div className='pb-2'>{children}</div>
	</AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

const TreeIcon = ({ item, isSelected, isOpen, default: Default }: any) => {
	const IconComponent = isSelected
		? item.selectedIcon
		: isOpen
		? item.openIcon
		: item.icon;

	if (IconComponent) {
		return <IconComponent className='w-4 h-4 text-accent mr-1.5' />;
	} else if (Default) {
		return <Default className='w-4 h-4 text-accent mr-1.5' />;
	} else {
		return <Folder className='w-4 h-4 text-accent mr-1.5' />;
	}
};

const TreeActions = ({
	children,
	isSelected,
}: {
	children?: React.ReactNode;
	isSelected?: boolean;
}) => {
	if (!children || !isSelected) return null;
	return <div className='actions flex right-0'>{children}</div>;
};

export { TreeView };
