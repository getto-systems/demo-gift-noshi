export interface ActionTestRunner<S> {
    addTestCase(testCase: ActionTestCase<S>): void
    run(done: ActionTestCheckDoneHook): ActionStateHandler<S>
}
export function setupAsyncActionTestRunner<S>(
    hasDone: ActionHasDone<S>,
    testCases: ActionTestCase<S>[],
): ActionTestIgniter<S> {
    return setupActionTestCase(runner(), testCases)

    function runner(): ActionTestRunner<S> {
        const runner = setupActionTestBasicRunner<S>()
        return {
            addTestCase: runner.enqueue,
            run: (hook) => {
                const checkState = runner.run(hook)
                if (!checkState.testCaseExists) {
                    return () => {
                        // テストケースが存在しない場合は何もしない state handler を返す
                    }
                }
                const { checker } = checkState
                return (state) => {
                    checker.pushState(state)

                    // 非同期的なアクションなので、完了状態に到達した時点で試験を開始する
                    if (hasDone(state)) {
                        checker.examine()
                    }
                }
            },
        }
    }
}
export function setupSyncActionTestRunner<S>(testCases: ActionTestCase<S>[]): ActionTestIgniter<S> {
    return setupActionTestCase(runner(), testCases)

    function runner(): ActionTestRunner<S> {
        const runner = setupActionTestBasicRunner<S>()
        return {
            addTestCase: (testCase) => {
                runner.enqueue({
                    statement: (check) => {
                        if (testCase.statement.length > 0) {
                            // 同期的なテストだが、done 判定をテストケース側でやりたいこともある
                            testCase.statement(check)
                            return
                        }

                        testCase.statement(() => {
                            // 型に合わせて引数を指定しているが、受け取られない
                        })
                        // 同期的なテストなので、ステートメント実行後にテストを行う
                        check()
                    },
                    examine: testCase.examine,
                })
            },
            run: (hook) => {
                const checkState = runner.run(hook)
                if (!checkState.testCaseExists) {
                    return () => {
                        // テストケースが存在しない場合は何もしない state handler を返す
                    }
                }
                return checkState.checker.pushState
            },
        }
    }
}
function setupActionTestCase<S>(
    runner: ActionTestRunner<S>,
    testCases: ActionTestCase<S>[],
): ActionTestIgniter<S> {
    testCases.forEach((testCase) => runner.addTestCase(testCase))
    return (done) => runner.run(done)
}

export type ActionTestCase<S> = Readonly<{
    statement: ActionTestStatement
    examine: ExamineActionStateStack<S>
}>
export interface ActionTestStatement {
    (hook: { (): void }): void
}
export interface ActionTestIgniter<S> {
    (done: ActionTestCheckDoneHook): ActionStateHandler<S>
}
interface ActionTestCheckDoneHook {
    (): void
}

interface ActionTestBasicRunner<S> {
    enqueue(testCase: ActionTestCase<S>): void
    run(done: ActionTestCheckDoneHook): ActionTestCheckState<S>
}

type ActionTestCheckState<S> =
    | Readonly<{ testCaseExists: false }>
    | Readonly<{ testCaseExists: true; checker: ActionTestChecker<S> }>

interface ActionTestChecker<S> {
    pushState(state: S): void
    examine(): void
}

function setupActionTestBasicRunner<S>(): ActionTestBasicRunner<S> {
    let queue: ActionTestCase<S>[] = []

    return {
        enqueue,
        run,
    }

    function enqueue(testCase: ActionTestCase<S>) {
        queue = [...queue, testCase]
    }
    function run(done: ActionTestCheckDoneHook): ActionTestCheckState<S> {
        if (queue.length === 0) {
            done()
            return { testCaseExists: false }
        }

        let current = queue[0]
        queue = queue.slice(1)

        let stack: S[] = []

        // リソースを返してからステートメントを実行するための setTimeout
        setTimeout(() => {
            stack = []
            current.statement(examineCurrent)
        })

        return {
            testCaseExists: true,
            checker: {
                pushState,
                examine: examineCurrent,
            },
        }

        function pushState(state: S) {
            stack = [...stack, state]
        }
        function examineCurrent() {
            current.examine(stack)
            checkNext()
        }
        function checkNext() {
            if (queue.length === 0) {
                done()
                return
            }

            current = queue[0]
            queue = queue.slice(1)

            stack = []
            current.statement(examineCurrent)
        }
    }
}

export interface ActionStateHandler<S> {
    (state: S): void
}
export interface ActionHasDone<S> {
    (state: S): boolean
}
export interface ExamineActionStateStack<S> {
    (stack: S[]): void
}
