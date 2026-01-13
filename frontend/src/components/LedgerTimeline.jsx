
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function LedgerTimeline({ entries }) {
    if (!entries || entries.length === 0) return <div>No history</div>;

    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {entries.map((entry, entryIdx) => (
                    <li key={entry.id}>
                        <div className="relative pb-8">
                            {entryIdx !== entries.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex space-x-3">
                                <div>
                                    <span className={classNames(
                                        'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                                        entry.action === 'ISSUED' ? 'bg-green-500' :
                                            entry.action === 'AMENDED' ? 'bg-yellow-500' :
                                                entry.action === 'VERIFIED' ? 'bg-blue-500' : 'bg-gray-500'
                                    )}>
                                        {/* Icon placeholder - can add Heroicons later */}
                                        <span className="text-white text-xs font-bold">{entry.action[0]}</span>
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {entry.action} <span className="font-medium text-gray-900">by User #{entry.actor_id}</span>
                                        </p>
                                        {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                                            <div className="mt-1 text-xs text-gray-400 bg-gray-50 p-2 rounded">
                                                <pre>{JSON.stringify(entry.metadata, null, 2)}</pre>
                                            </div>
                                        )}
                                    </div>
                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                        <time dateTime={entry.created_at}>{new Date(entry.created_at).toLocaleString()}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
