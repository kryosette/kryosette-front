// components/posts/poll/poll.tsx
'use client'

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Check, ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"

interface PollProps {
    poll: {
        id: number
        question: string
        options: {
            id: number
            text: string
            voteCount: number
            voted: boolean
            votes?: {
                userId: string
                votedAt: string
            }[]
        }[]
        multipleChoice: boolean
        expiresAt: string | null
        voted: boolean
        totalVotes: number
    }
    onVote: (optionIds: number[]) => void
    isVoting: boolean
    currentUserId?: string
}

export function PollComponent({ poll, onVote, isVoting, currentUserId }: PollProps) {
    const [selectedOptions, setSelectedOptions] = useState<number[]>([])
    const [expandedOption, setExpandedOption] = useState<number | null>(null)

    const storageKey = `poll_${poll.id}_voted`

    useEffect(() => {
        const votedOptions = localStorage.getItem(storageKey);
        if (votedOptions) {
            setSelectedOptions(JSON.parse(votedOptions));
        }
    }, [storageKey])

    const handleOptionClick = (optionId: number) => {
        if (poll.voted) {
            setExpandedOption(expandedOption === optionId ? null : optionId)
            return;
        }

        let newSelectedOptions: number[];
        if (poll.multipleChoice) {
            setSelectedOptions(prev =>
                prev.includes(optionId)
                    ? prev.filter(id => id !== optionId)
                    : [...prev, optionId]
            )
        } else {
            newSelectedOptions = [optionId]
        }

        setSelectedOptions(newSelectedOptions)
        localStorage.setItem(storageKey, JSON.stringify(newSelectedOptions))
    }

    const handleVote = () => {
        if (selectedOptions.length === 0 || poll.voted) return
        onVote(selectedOptions)
    }

    return (
        <div className="mt-4 border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-3">{poll.question}</h3>

            {poll.expiresAt && (
                <p className="text-xs text-gray-500 mb-3">
                    Closes {new Date(poll.expiresAt).toLocaleDateString()}
                </p>
            )}

            <div className="space-y-2 mb-4">
                {poll.options.map(option => (
                    <div key={option.id} className="relative">
                        <button
                            onClick={() => handleOptionClick(option.id)}
                            disabled={poll.voted || isVoting}
                            className={`w-full text-left p-2 rounded-md border transition-colors ${(selectedOptions.includes(option.id) || option.voted
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:bg-gray-100'
                            )} ${poll.voted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                            <div className="flex justify-between items-center">
                                <span>{option.text}</span>
                                {option.voted && <Check className="h-4 w-4 text-indigo-600" />}
                            </div>

                            {poll.voted && (
                                <div className="mt-2">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>{Math.round((option.voteCount / poll.totalVotes) * 100)}%</span>
                                        <span>{option.voteCount} votes</span>
                                    </div>
                                    <Progress
                                        value={(option.voteCount / poll.totalVotes) * 100}
                                        className="h-2 bg-gray-200"
                                    />
                                </div>
                            )}

                            {poll.voted && expandedOption === option.id && option.votes && (
                                <div className="mt-2 p-2 bg-gray-100 rounded-md">
                                    <h4 className="text-xs font-medium text-gray-700 mb-1">Voters:</h4>
                                    <ul className="space-y-1">
                                        {option.votes.map((vote, index) => (
                                            <li key={index} className="text-xs text-gray-600">
                                                {vote.userId} - {new Date(vote.votedAt).toLocaleString()}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {!poll.voted && (
                <Button
                    onClick={handleVote}
                    disabled={selectedOptions.length === 0 || isVoting}
                    size="sm"
                    className="w-full"
                >
                    {isVoting ? 'Voting...' : 'Vote'}
                </Button>
            )}

            {poll.voted && (
                <p className="text-xs text-gray-500 text-center mt-2">
                    {poll.totalVotes} total votes
                </p>
            )}
        </div>
    )
}